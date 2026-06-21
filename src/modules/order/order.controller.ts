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
    const newStatus = req.body.status;

    if (!user) {
      return res.status(401).json({
        success: false,
        details: "Unauthorized",
      });
    }

    const updatedOrder = await orderService.updateOrderStatus(
      orderId as string,
      user.id as string,
      user.role as string,
      newStatus,
    );

    res.status(200).json({
      success: true,
      result: updatedOrder,
    });
  } catch (error: any) {
    res.status(403).json({
      success: false,
      details: error.message || "Something went wrong",
    });
  }
};


export const orderController = {
  createOrder,
  getAllOrders,
  getOrdersById,
  updateOrderStatus,
};
