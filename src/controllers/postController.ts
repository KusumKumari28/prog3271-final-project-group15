import { Request, Response } from "express";
import mongoose from "mongoose";
import Post from "../models/Post";

// CREATE POST
export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    const user = (req as any).user;

    if (!user || !user.id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const post = await Post.create({
      title,
      content,
      author: user.id,
    });

    return res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create post",
      error,
    });
  }
};

// GET ALL POSTS
export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Posts fetched successfully",
      posts,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch posts",
      error,
    });
  }
};

// GET POST BY ID
export const getPostById = async (req: Request, res: Response) => {
  try {
  const id = String(req.params.id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }

    const post = await Post.findById(id).populate("author", "name email");

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    return res.status(200).json({
      message: "Post fetched successfully",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch post",
      error,
    });
  }
};