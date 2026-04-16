import { Request, Response } from "express";
import mongoose from "mongoose";
import Like from "../models/Like";

export const likePost = async (req: Request, res: Response) => {
  try {
    const rawPostId = req.params.postId;
    const rawUserId = (req as any).user?.id;

    const postId = Array.isArray(rawPostId) ? rawPostId[0] : rawPostId;
    const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const existingLike = await Like.findOne({
      user: userId,
      post: postId,
    });

    if (existingLike) {
      return res.status(400).json({
        message: "Post already liked",
      });
    }

    const newLike = await Like.create({
      user: new mongoose.Types.ObjectId(userId),
      post: new mongoose.Types.ObjectId(postId),
    });

    return res.status(201).json({
      message: "Post liked successfully",
      like: newLike,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to like post",
    });
  }
};

export const unlikePost = async (req: Request, res: Response) => {
  try {
    const rawPostId = req.params.postId;
    const rawUserId = (req as any).user?.id;

    const postId = Array.isArray(rawPostId) ? rawPostId[0] : rawPostId;
    const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!postId) {
      return res.status(400).json({
        message: "Post ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }

    const deletedLike = await Like.findOneAndDelete({
      user: new mongoose.Types.ObjectId(userId),
      post: new mongoose.Types.ObjectId(postId),
    });

    if (!deletedLike) {
      return res.status(404).json({
        message: "Like not found",
      });
    }

    return res.status(200).json({
      message: "Post unliked successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to unlike post",
    });
  }
};
