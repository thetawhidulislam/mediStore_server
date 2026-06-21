/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import stripe from "../../config/stripe.config";
import { PaymentService } from "./payment.service";

const handleStripeWebhookEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const signature = req.headers["stripe-signature"] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
    if (!signature || !webhookSecret) {
      console.error("Missing Stripe signature or webhook secret");
      res.status(400).json({
        success: false,
        message: "Missing Stripe signature or webhook secret",
        data: null,
        meta: null,
      });
    }
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret,
      );
    } catch (error) {
      console.error("Error constructing Stripe webhook event:", error);
      res.status(400).json({
        success: false,
        message: "Invalid Stripe webhook signature",
      });
    }
    try {
      const result = await PaymentService.handlerStripeWebhookEvent(
        event as any,
      );
      res.status(200).json({
        success: true,
        message: "Stripe webhook event processed successfully",

        data: result,
      });
    } catch (error) {
      console.error("Error handling Stripe webhook event:", error);
      res.status(500).json({
        success: false,

        message: "Error handling Stripe webhook event",
      });
    }
  } catch (error: any) {
    next(error);
  }
};
export const PaymentController = {
  handleStripeWebhookEvent,
};
