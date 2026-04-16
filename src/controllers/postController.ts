import { Request, Response } from "express";
import mongoose from "mongoose";
import Post from "../models/Post";
import Like from "../models/Like";

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
    const posts = await Post.find();

    const postsWithLikes = await Promise.all(
      posts.map(async (post) => {
        const likeCount = await Like.countDocuments({
          post: post._id,
        });

        return {
          ...post.toObject(),
          likeCount,
        };
      })
    );

    return res.status(200).json({
      posts: postsWithLikes,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching posts",
      error,
    });
  }
};

// GET POST BY ID
export const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const likeCount = await Like.countDocuments({
      post: post._id,
    });

    return res.status(200).json({
      post: {
        ...post.toObject(),
        likeCount,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching post",
      error,
    });
  }
};

// UPDATE POST
export const updatePost = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { title, content } = req.body;
    const user = (req as any).user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (!user || !user.id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (post.author.toString() !== user.id) {
      return res.status(403).json({
        message: "You can only update your own post",
      });
    }

    if (title !== undefined) {
      post.title = title;
    }

    if (content !== undefined) {
      post.content = content;
    }

    await post.save();

    return res.status(200).json({
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update post",
      error,
    });
  }
};

// DELETE POST
export const deletePost = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const user = (req as any).user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (!user || !user.id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (post.author.toString() !== user.id) {
      return res.status(403).json({
        message: "You can only delete your own post",
      });
    }

    await Post.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete post",
      error,
    });
  }
};