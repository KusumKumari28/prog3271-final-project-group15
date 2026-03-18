import { Request, Response, NextFunction } from "express";

// simple logger middleware
const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.method + " " + req.url + " - " + new Date().toISOString());
  next();
};

export default logger;