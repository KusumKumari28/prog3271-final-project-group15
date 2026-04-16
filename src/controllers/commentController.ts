import { Request, Response } from "express";

export const createComment = async (req: Request, res: Response) => {
  try {
    return res.status(201).json({
      message: "Create comment API working",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create comment",
    });
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      message: "Get comments API working",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get comments",
    });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      message: "Update comment API working",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update comment",
    });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      message: "Delete comment API working",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete comment",
    });
  }
};
