import { Router } from "express";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/postController";
import authMiddleware from "../middleware/authMiddleware";
import { adminDeletePost } from "../controllers/postController";
import roleMiddleware from "../middleware/roleMiddleware";


const router = Router();

router.post("/", authMiddleware, createPost);
router.get("/", getPosts);
router.get("/:id", getPostById);
router.put("/:id", authMiddleware, updatePost);
// DELETE /api/posts/admin/:id
router.delete(
  "/admin/:id",
  authMiddleware,
  roleMiddleware("admin"),
  adminDeletePost
);

export default router;