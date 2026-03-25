import express from "express";
import authMiddleware, { AuthRequest } from "../middleware/authMiddleware";
import roleMiddleware from "../middleware/roleMiddleware";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({
    message: "Test route working",
  });
});

router.get("/protected", authMiddleware, (req: AuthRequest, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

router.get(
  "/admin",
  authMiddleware,
  roleMiddleware("admin"),
  (req: AuthRequest, res) => {
    res.json({
      message: "Welcome admin",
      user: req.user,
    });
  },
);

export default router;
