import { Router } from "express";
import {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} from "../controllers/commentController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.post("/:postId", authMiddleware, createComment);
router.get("/:postId", getComments);
router.put("/:id", authMiddleware, updateComment);
router.delete("/:id", authMiddleware, deleteComment);

export default router;
