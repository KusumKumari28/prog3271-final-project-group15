import { Router } from "express";
import {
  createComment,
  getCommentsByPostId,
} from "../controllers/commentController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.post("/:postId/comments", authMiddleware, createComment);
router.get("/:postId/comments", getCommentsByPostId);

export default router;