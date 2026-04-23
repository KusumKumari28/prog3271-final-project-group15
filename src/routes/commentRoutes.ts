import { Router } from "express";
import {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} from "../controllers/commentController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

// POST   /api/posts/:postId/comments  - create comment
// GET    /api/posts/:postId/comments  - get comments for a post
// PUT    /api/posts/comments/:id      - update a comment
// DELETE /api/posts/comments/:id      - delete a comment

router.post("/:postId/comments", authMiddleware, createComment);
router.get("/:postId/comments", getComments);
router.put("/comments/:id", authMiddleware, updateComment);
router.delete("/comments/:id", authMiddleware, deleteComment);

export default router;
