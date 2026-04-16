import { Router } from "express";
import { likePost, unlikePost } from "../controllers/likeController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.post("/:postId", authMiddleware, likePost);
router.delete("/:postId", authMiddleware, unlikePost);

export default router;
