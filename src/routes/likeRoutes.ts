import { Router } from "express";
import { likePost } from "../controllers/likeController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

// POST /api/likes/:postId
router.post("/:postId", authMiddleware, likePost);

export default router;