import { Router } from "express";
import { createPost } from "../controllers/postController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.post("/", authMiddleware, createPost);

export default router;