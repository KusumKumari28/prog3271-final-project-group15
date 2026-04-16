import { Router } from "express";
import {
  createComment,
  getCommentsByPostId,
  updateComment,
  deleteComment,
} from "../controllers/commentController";
import authMiddleware from "../middleware/authMiddleware";
import { adminDeleteComment } from "../controllers/commentController";
import roleMiddleware from "../middleware/roleMiddleware";

const router = Router();

router.post("/:postId/comments", authMiddleware, createComment);
router.get("/:postId/comments", getCommentsByPostId);
router.put("/comments/:id", authMiddleware, updateComment);
// DELETE /api/comments/admin/:id
router.delete(
  "/admin/:id",
  authMiddleware,
  roleMiddleware("admin"),
  adminDeleteComment
);

export default router;