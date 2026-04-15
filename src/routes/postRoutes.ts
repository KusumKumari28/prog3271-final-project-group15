import { Router } from "express";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
} from "../controllers/postController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.post("/", authMiddleware, createPost);
router.get("/", getPosts);
router.get("/:id", getPostById);
router.put("/:id", authMiddleware, updatePost);

export default router;