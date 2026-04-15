import { Router } from "express";
import {
  createComment,
  getCommentsByPostId,
  updateComment,
  deleteComment,
} from "../controllers/commentController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.post("/:postId/comments", authMiddleware, createComment);
router.get("/:postId/comments", getCommentsByPostId);
router.put("/comments/:id", authMiddleware, updateComment);
router.delete("/comments/:id", authMiddleware, deleteComment);

export default router;