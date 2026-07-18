import express, { Router } from "express";
import { analyticsController } from "./analytics.controller";
import auth, { USERROLE } from "../../middlewere/auth";

const router = express.Router();

router.get(
  "/dashboard",
  auth(USERROLE.ADMIN, USERROLE.SELLER, USERROLE.CUSTOMER),
  analyticsController.getDashboardStats,
);

export const analyticsRouter: Router = router;
