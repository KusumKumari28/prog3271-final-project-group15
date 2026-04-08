import { Request, Response } from "express";

// simple controller for checking api
export const testAPI = (req: Request, res: Response) => {
  res.send("Test route is working");
};
