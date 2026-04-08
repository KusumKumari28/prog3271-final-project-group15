import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import roleMiddleware from "../middleware/roleMiddleware";

const router = express.Router();

/**
 * Test route
 */
router.get("/test", (req, res) => {
  res.json({
    message: "Test route working",
  });
});

/**
 * Protected route
 */
router.get("/protected", authMiddleware, (req: any, res) => {
  res.status(200).json({
    message: "Protected route accessed",
    user: req.user,
  });
});

/**
 * Admin-only route
 */
router.get(
  "/admin",
  authMiddleware,
  roleMiddleware("admin"),
  (req: any, res) => {
    res.json({
      message: "Welcome admin",
      user: req.user,
    });
  },
);

export default router;
