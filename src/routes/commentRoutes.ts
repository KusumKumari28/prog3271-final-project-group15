import { Router } from "express";
import {
  createComment,
  getCommentsByPostId,
  updateComment,
} from "../controllers/commentController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.post("/:postId/comments", authMiddleware, createComment);
router.get("/:postId/comments", getCommentsByPostId);
router.put("/comments/:id", authMiddleware, updateComment);

export default router;