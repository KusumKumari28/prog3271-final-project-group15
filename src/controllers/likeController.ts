import { Request, Response } from "express";
import Like from "../models/Like";

export const likePost = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { postId } = req.params;

    if (!user || !user.id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const existingLike = await Like.findOne({
      user: user.id,
      post: postId,
    });

    if (existingLike) {
      return res.status(400).json({
        message: "Post already liked",
      });
    }

    const like = await Like.create({
      user: user.id,
      post: postId,
    });

    return res.status(201).json({
      message: "Post liked successfully",
      like,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error liking post",
      error,
    });
  }
};