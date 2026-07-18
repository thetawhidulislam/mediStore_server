import {
  Orders,
  OrderStatus,
  PaymentStatus,
} from "../../../generated/prisma/client";

import stripe from "../../config/stripe.config";
import { prisma } from "../../lib/prisma";
import { USERROLE } from "../../middlewere/auth";
import { v7 as uuidv7 } from "uuid";

/**
 * CREATE ORDER (COD + STRIPE)
 */
const createOrder = async (
  data: Omit<
    Orders,
    "id" | "createdAt" | "updatedAt" | "paymentStatus" | "orderDate" | "payment"
  >,
  userId: string,
) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { customerId: userId },
      include: { medicines: true },
    });

    if (!cartItems.length) {
      throw new Error("Cart is empty");
    }

    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.quantity * item.medicines.price,
      0,
    );

    const paymentGateway = data.paymentGateway ?? "COD";

    const result = await prisma.$transaction(async (tx) => {
      // 1. CREATE ORDER
      const order = await tx.orders.create({
        data: {
          customerId: userId,
          totalPrice,
          shippingAddress: data.shippingAddress,
          paymentGateway,
          paymentStatus: PaymentStatus.UNPAID,

          orderItems: {
            create: cartItems.map((item) => ({
              medicineId: item.medicineId,
              quantity: item.quantity,
              price: item.medicines.price,
            })),
          },
        },
        include: {
          orderItems: {
            include: {
              medicines: true,
            },
          },
          customer: true,
        },
      });

      for (const item of cartItems) {
        await tx.medicines.update({
          where: { id: item.medicineId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // 3. CLEAR CART
      await tx.cartItem.deleteMany({
        where: { customerId: userId },
      });

      let paymentUrl: string | null = null;

      // 4. STRIPE PAYMENT ONLY IF CARD
      if (paymentGateway === "STRIPE") {
        const payment = await tx.payment.create({
          data: {
            orderId: order.id,
            amount: order.totalPrice,
            transactionId: uuidv7(),
            status: PaymentStatus.UNPAID,
          },
        });

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: `Medicine Order #${order.id}`,
                },
                unit_amount: Math.round(order.totalPrice * 100),
              },
              quantity: 1,
            },
          ],
          metadata: {
            orderId: order.id,
            paymentId: payment.id,
          },
          success_url: `${process.env.FRONTEND_URL}/customer-dashboard/order/${order.id}`,
          cancel_url: `${process.env.FRONTEND_URL}/`,
        });

        paymentUrl = session.url;
      }

      return {
        order,
        paymentUrl,
      };
    });

    return result;
  } catch (err) {
    console.error("Order creation failed:", err);
    throw new Error("Could not complete order");
  }
};

/**
 * GET ALL ORDERS
 */
const getAllOrders = async (user: { id: string; role: USERROLE }) => {
  let whereCondition: any = {};

  if (user.role === USERROLE.ADMIN) {
    whereCondition = {};
  } else if (user.role === USERROLE.CUSTOMER) {
    whereCondition = { customerId: user.id };
  } else if (user.role === USERROLE.SELLER) {
    whereCondition = {
      orderItems: {
        some: {
          medicines: {
            sellerId: user.id,
          },
        },
      },
    };
  }

  return await prisma.orders.findMany({
    where: whereCondition,
    include: {
      customer: {
        select: {
          name: true,
          email: true,
          image: true,
          role: true,
          phone: true,
        },
      },
      orderItems: {
        include: {
          medicines: {
            select: {
              id: true,
              name: true,
              price: true,
              manufacturer: true,
              seller: {
                select: {
                  name: true,
                  categories: {
                    select: { name: true },
                  },
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      orderDate: "desc",
    },
  });
};

/**
 * GET ORDER BY ID
 */
const getOrderById = async (orderId: string, user: any) => {
  const order = await prisma.orders.findUnique({
    where: { id: orderId },
    include: {
      customer: true,
      orderItems: {
        include: {
          medicines: {
            include: {
              seller: true,
            },
          },
        },
      },
    },
  });

  if (!order) throw new Error("Order not found");

  if (user.role === USERROLE.CUSTOMER && order.customerId !== user.id) {
    throw new Error("Not authorized");
  }

  if (user.role === USERROLE.SELLER) {
    const sellerItems = order.orderItems.filter(
      (item) => item.medicines.sellerId === user.id,
    );

    if (!sellerItems.length) {
      throw new Error("Not authorized to view this order");
    }

    const sellerSubtotal = sellerItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0,
    );

    return {
      orderId: order.id,
      status: order.paymentStatus,
      orderDate: order.orderDate,
      totalPrice: order.totalPrice,
      customer: order.customer,
      items: sellerItems,
      sellerSubtotal,
    };
  }

  return order;
};

/**
 * UPDATE ORDER STATUS
 * (COD support + seller/admin control)
 */
const updateOrderStatus = async (
  orderId: string,
  userId: string,
  userRoles: string,
  newStatus: OrderStatus,
) => {
  // safety check: newStatus valid enum value kina
  if (!Object.values(OrderStatus).includes(newStatus)) {
    throw new Error("Invalid status value");
  }

  const order = await prisma.orders.findUnique({ where: { id: orderId } });
  if (!order) throw new Error("Order not found");

  // CUSTOMER — sudhu nijer order cancel korte parbe
  if (userRoles.includes(USERROLE.CUSTOMER)) {
    if (newStatus !== OrderStatus.CANCEL) {
      throw new Error("Customer can only cancel order");
    }
    if (order.customerId !== userId) throw new Error("Not authorized");

    return prisma.orders.update({
      where: { id: orderId },
      data: { status: OrderStatus.CANCEL, updatedAt: new Date() }, // ✅ status field e likhcho
    });
  }

  // ADMIN — full control (age eta chilo-i na!)
  if (userRoles.includes(USERROLE.ADMIN)) {
    return prisma.orders.update({
      where: { id: orderId },
      data: { status: newStatus, updatedAt: new Date() }, // ✅ admin je status pathay, sheita e set hoy
    });
  }

  // SELLER — sudhu nijer medicine-er order status update korte parbe, cancel korte parbe na
  if (userRoles.includes(USERROLE.SELLER)) {
    const sellerItems = await prisma.orderItem.findMany({
      where: { orderId, medicines: { sellerId: userId } },
    });
    if (!sellerItems.length) throw new Error("Not authorized");
    if (newStatus === OrderStatus.CANCEL) {
      throw new Error("Sellers cannot cancel an order");
    }

    return prisma.orders.update({
      where: { id: orderId },
      data: { status: newStatus, updatedAt: new Date() },
    });
  }

  throw new Error("Not authorized");
};
export const orderService = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};
