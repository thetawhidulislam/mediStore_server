import { Request, Response } from "express";
import { StatsService } from "./analytics.service";

const getDashboardStats = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const result = await StatsService.getDashboardStatsData(req.user as any);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({
      success: false,
      details: error instanceof Error ? error.message : "Something went wrongs",
    });
  }
};

export const analyticsController = { getDashboardStats };
