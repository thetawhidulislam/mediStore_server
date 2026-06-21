import Stripe from "stripe";
import { PaymentStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const handlerStripeWebhookEvent = async (event: Stripe.Event) => {
  try {
    // 🔒 prevent duplicate events (idempotency)
    const existingEvent = await prisma.payment.findFirst({
      where: {
        stripeEventId: event.id,
      },
    });

    if (existingEvent) {
      return { message: "Event already processed" };
    }

    switch (event.type) {
      /**
       * ✅ SUCCESS PAYMENT
       */
      case "checkout.session.completed": {
        const session = event.data.object as any;

        const orderId = session.metadata?.orderId;
        const paymentId = session.metadata?.paymentId;

        if (!orderId || !paymentId) {
          return { message: "Missing metadata" };
        }

        await prisma.$transaction(async (tx) => {
          // ✅ update order
          await tx.orders.update({
            where: { id: orderId },
            data: {
              paymentStatus: PaymentStatus.PAID,
            },
          });

          // ✅ update payment
          await tx.payment.update({
            where: { id: paymentId },
            data: {
              status: PaymentStatus.PAID,
              stripeEventId: event.id,
              paymentGatewayData: session,
            },
          });
        });

        return { message: "Payment completed successfully" };
      }

      /**
       * ❌ EXPIRED SESSION
       */
      case "checkout.session.expired": {
        const session = event.data.object as any;

        console.log("Session expired:", session.id);
        return { message: "Session expired" };
      }

      /**
       * ❌ PAYMENT FAILED
       */
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as any;

        console.log("Payment failed:", paymentIntent.id);
        return { message: "Payment failed" };
      }

      default:
        return { message: `Unhandled event: ${event.type}` };
    }
  } catch (error) {
    console.error("Webhook error:", error);
    throw new Error("Webhook processing failed");
  }
};

export const PaymentService = {
  handlerStripeWebhookEvent,
};
