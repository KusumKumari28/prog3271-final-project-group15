import { Request, Response } from "express";
import User from "../models/User";
import Post from "../models/Post";
import Comment from "../models/Comment";
import Like from "../models/Like";

// GET ANALYTICS - overall site statistics
export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const totalComments = await Comment.countDocuments();
    const totalLikes = await Like.countDocuments();

    return res.status(200).json({
      analytics: {
        totalUsers,
        totalPosts,
        totalComments,
        totalLikes,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching analytics",
      error,
    });
  }
};

// GET ALL USERS - user analytics
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");

    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching users",
      error,
    });
  }
};