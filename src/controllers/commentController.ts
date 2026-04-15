import { Request, Response } from "express";
import mongoose from "mongoose";
import Comment from "../models/Comment";
import Post from "../models/Post";

// CREATE COMMENT
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

// GET COMMENTS
export const getCommentsByPostId = async (req: Request, res: Response) => {
  try {
    const postId = String(req.params.postId);

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const comments = await Comment.find({ post: postId })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Comments fetched successfully",
      comments,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch comments",
      error,
    });
  }
};

// UPDATE COMMENT
export const updateComment = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { content } = req.body;
    const user = (req as any).user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid comment ID",
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

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (comment.author.toString() !== user.id) {
      return res.status(403).json({
        message: "You can only update your own comment",
      });
    }

    comment.content = content.trim();
    await comment.save();

    return res.status(200).json({
      message: "Comment updated successfully",
      comment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update comment",
      error,
    });
  }
};

// DELETE COMMENT
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const user = (req as any).user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid comment ID",
      });
    }

    if (!user || !user.id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (comment.author.toString() !== user.id) {
      return res.status(403).json({
        message: "You can only delete your own comment",
      });
    }

    await Comment.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete comment",
      error,
    });
  }
};