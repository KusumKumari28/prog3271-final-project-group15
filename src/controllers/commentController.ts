import { Request, Response } from "express";
import mongoose from "mongoose";
import Comment from "../models/Comment";
import Post from "../models/Post";

export const createComment = async (req: Request, res: Response) => {
  try {
    const postId = String(req.params.postId);
    const { content } = req.body;
    const user = (req as any).user;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Comment content is required",
      });
    }

    if (!user || !user.id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const comment = await Comment.create({
      content: content.trim(),
      post: postId,
      author: user.id,
    });

    return res.status(201).json({
      message: "Comment created successfully",
      comment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create comment",
      error,
    });
  }
};