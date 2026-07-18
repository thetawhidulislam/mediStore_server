import { NextFunction, Request, Response } from "express";
import { orderService } from "./order.service";
import { USERROLE } from "../../middlewere/auth";

const createOrder = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const result = await orderService.createOrder(req.body, user?.id as string);
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "order created failed",
      details: error,
    });
  }
};
const getAllOrders = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user || !user.id || !user.role) {
      return res.status(401).json({
        error: "Unauthorized: user information missing",
      });
    }
    const result = await orderService.getAllOrders({
      id: user.id as string,
      role: user.role as USERROLE,
    });
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "order find failed",
      details: error,
    });
  }
};
const getOrdersById = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const user = req.user;
    const result = await orderService.getOrderById(orderId as string, user);
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "order find failed",
      details: error,
    });
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { orderId } = req.params;
    const user = req.user;
    // "status" (notun, correct key) OR "paymentStatus" (purono client backward-compat)
    const newStatus = req.body.status ?? req.body.paymentStatus;

    if (!user) {
      return res.status(401).json({ success: false, details: "Unauthorized" });
    }

    const updatedOrder = await orderService.updateOrderStatus(
      orderId as string,
      user.id as string,
      user.role as USERROLE,
      newStatus,
    );
    res.status(200).json({ success: true, result: updatedOrder });
  } catch (error: unknown) {
    const details = error instanceof Error ? error.message : String(error);
    res.status(403).json({ success: false, details });
  }
};

export const orderController = {
  createOrder,
  getAllOrders,
  getOrdersById,
  updateOrderStatus,
};
