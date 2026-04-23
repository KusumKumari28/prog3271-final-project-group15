import { Request, Response, NextFunction } from "express";

// Structured JSON logger middleware (course requirement: Week 3 logging)
const logger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on("finish", () => {
    const log = {
      level: "info",
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      responseTimeMs: Date.now() - start,
    };
    console.log(JSON.stringify(log));
  });

  next();
};

export default logger;