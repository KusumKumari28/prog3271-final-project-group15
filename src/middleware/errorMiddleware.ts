import { Request, Response, NextFunction } from "express";

const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  return res.status(status).json({
    message,
  });
};

export default errorMiddleware;