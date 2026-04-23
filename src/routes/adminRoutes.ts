import { Router } from "express";
import { getAnalytics, getAllUsers } from "../controllers/adminController";
import authMiddleware from "../middleware/authMiddleware";
import roleMiddleware from "../middleware/roleMiddleware";

const router = Router();

// Only admin can access
router.get(
  "/analytics",
  authMiddleware,
  roleMiddleware(["admin"]),
  getAnalytics,
);

// Admin: get all users
router.get(
  "/users",
  authMiddleware,
  roleMiddleware(["admin"]),
  getAllUsers,
);

export default router;
