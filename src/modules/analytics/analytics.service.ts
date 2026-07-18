import { prisma } from "../../lib/prisma";
import { USERROLE } from "../../middlewere/auth";

// mediStore-er auth middleware-e req.user ei shape-e set hoy
type RequestUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

// ✅ Pattern: ekta single dispatcher function, role onujayi bhinno stats function call kore
const getDashboardStatsData = async (user: RequestUser) => {
  switch (user.role) {
    case USERROLE.ADMIN:
      return getAdminStatsData();
    case USERROLE.SELLER:
      return getSellerStatsData(user.id);
    case USERROLE.CUSTOMER:
      return getCustomerStatsData(user.id);
    default:
      throw new Error("Invalid user role");
  }
};

// ---------------- ADMIN ----------------
const getAdminStatsData = async () => {
  const orderCount = await prisma.orders.count();
  const medicineCount = await prisma.medicines.count();
  const userCount = await prisma.user.count();
  const categoryCount = await prisma.category.count();

  const totalRevenue = await prisma.orders.aggregate({
    _sum: { totalPrice: true },
    where: { paymentStatus: "PAID" },
  });

  const pieChartData = await getOrderStatusPieChart();

  // Shob order-er date niye ashi, month onujayi bhag korbo JS-e (niche
  // bucketByMonth function-e), DATE_TRUNC('month', ...)-er moto SQL lagbe na
  const allOrders = await prisma.orders.findMany({
    select: { orderDate: true },
  });
  const barChartData = bucketByMonth(allOrders.map((o) => o.orderDate));

  return {
    orderCount,
    medicineCount,
    userCount,
    categoryCount,
    totalRevenue: totalRevenue._sum.totalPrice || 0,
    pieChartData,
    barChartData,
  };
};

// ---------------- SELLER ----------------
const getSellerStatsData = async (sellerId: string) => {
  const medicineCount = await prisma.medicines.count({
    where: { sellerId },
  });

  // "amar medicine-er ekta ba beshi item-er order" — relation filter diyei
  // (some) eta khoja jai, join/raw SQL lagbe na
  const sellerOrderFilter = {
    orderItems: {
      some: {
        medicines: { sellerId },
      },
    },
  };

  const orderCount = await prisma.orders.count({
    where: sellerOrderFilter,
  });

  // Revenue: price * quantity — duita field-er product, Prisma-r
  // aggregate() eta directly korte pare na, tai matching item gula
  // fetch kore JS-e jog kore nichi
  const paidItems = await prisma.orderItem.findMany({
    where: {
      medicines: { sellerId },
      order: { paymentStatus: "PAID" },
    },
    select: { price: true, quantity: true },
  });
  const totalRevenue = paidItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const pieChartData = await prisma.orders.groupBy({
    by: ["status"],
    _count: { id: true },
    where: sellerOrderFilter,
  });

  const sellerOrders = await prisma.orders.findMany({
    where: sellerOrderFilter,
    select: { orderDate: true },
  });
  const barChartData = bucketByMonth(sellerOrders.map((o) => o.orderDate));

  return {
    medicineCount,
    orderCount,
    totalRevenue,
    pieChartData: pieChartData.map(({ status, _count }) => ({
      status,
      count: _count.id,
    })),
    barChartData,
  };
};

// ---------------- CUSTOMER ----------------
const getCustomerStatsData = async (customerId: string) => {
  const orderCount = await prisma.orders.count({ where: { customerId } });

  const totalSpent = await prisma.orders.aggregate({
    _sum: { totalPrice: true },
    where: { customerId, paymentStatus: "PAID" },
  });

  const pieChartData = await prisma.orders.groupBy({
    by: ["status"],
    _count: { id: true },
    where: { customerId },
  });

  return {
    orderCount,
    totalSpent: totalSpent._sum.totalPrice || 0,
    pieChartData: pieChartData.map(({ status, _count }) => ({
      status,
      count: _count.id,
    })),
  };
};

// ---------------- SHARED HELPERS ----------------
const getOrderStatusPieChart = async () => {
  const distribution = await prisma.orders.groupBy({
    by: ["status"],
    _count: { id: true },
  });

  return distribution.map(({ status, _count }) => ({
    status,
    count: _count.id,
  }));
};

// Ekta list of Date niye, "YYYY-MM" onujayi count kore dey — eta
// DATE_TRUNC('month', ...) SQL-er JS-version
const bucketByMonth = (dates: Date[]) => {
  const counts = new Map<string, number>();

  for (const date of dates) {
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    counts.set(month, (counts.get(month) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));
};

export const StatsService = { getDashboardStatsData };
