import { Router } from "express";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  adminDeletePost,
  adminUpdatePost,
} from "../controllers/postController";
import authMiddleware from "../middleware/authMiddleware";
import roleMiddleware from "../middleware/roleMiddleware";

const router = Router();

router.post("/", authMiddleware, createPost);
router.get("/", getPosts);
router.get("/:id", getPostById);
router.put("/:id", authMiddleware, updatePost);
router.delete("/:id", authMiddleware, deletePost);

// Admin / super-user routes
router.delete(
  "/admin/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  adminDeletePost,
);

router.put(
  "/admin/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  adminUpdatePost,
);

export default router;
