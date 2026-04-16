import { Router } from "express";
import { getAnalytics } from "../controllers/adminController";
import authMiddleware from "../middleware/authMiddleware";
import roleMiddleware from "../middleware/roleMiddleware";

const router = Router();

// Only admin can access
router.get(
  "/analytics",
  authMiddleware,
  roleMiddleware("admin"),
  getAnalytics
);

export default router;
