import { Request, Response, NextFunction } from "express";

const roleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;

      if (!user || !user.role) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          message: "Forbidden",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        message: "Server error",
      });
    }
  };
};

export default roleMiddleware;
