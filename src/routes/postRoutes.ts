import { Router } from "express";
import {
  createPost,
  getPosts,
  getPostById,
} from "../controllers/postController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.post("/", authMiddleware, createPost);
router.get("/", getPosts);
router.get("/:id", getPostById);

export default router;