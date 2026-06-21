import express, { Application } from "express";
import cors from "cors";
import { notFound } from "./middlewere/notFound";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { CategoryRouter } from "./modules/Category/category.route";
import { MedicinesRouter } from "./modules/medicine/medicine.route";
import { ReviewRouter } from "./modules/reviews/review.route";
import { CartRouter } from "./modules/cart/cart.route";
import { CartItemRouter } from "./modules/cartItem/cartItem.route";
import { orderRouter } from "./modules/order/order.route";
import errorHandler from "./middlewere/globalErrorHandler";
import { UserRouter } from "./modules/user/user.route";
import { PaymentController } from "./modules/payment/payment.controller";
const allowedOrigins = [
  process.env.APP_URL || "http://localhost:3000",
  process.env.FRONTEND_URL, // Production frontend URL
  "http://localhost:4000",
  "http://localhost:5000",
].filter(Boolean); // Remove undefined values

const app: Application = express();

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      // Check if origin is in allowedOrigins or matches Vercel preview pattern
      const isAllowed =
        allowedOrigins.includes(origin) ||
        /^https:\/\/next-blog-client.*\.vercel\.app$/.test(origin) ||
        /^https:\/\/.*\.vercel\.app$/.test(origin); // Any Vercel deployment

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  }),
);

app.use(express.json());
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  PaymentController.handleStripeWebhookEvent,
);
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api/user", UserRouter);
app.use("/admin/category", CategoryRouter);
app.use("/medicine", MedicinesRouter);
app.use("/review", ReviewRouter);
app.use("/cart", CartRouter);
app.use("/cartItem", CartItemRouter);
app.use("/api/orders", orderRouter);
app.get("/", (req, res) => {
  res.send("hello world");
});
app.use(notFound);
app.use(errorHandler);

export default app;
