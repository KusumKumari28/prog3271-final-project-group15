import express from "express";
import cors from "cors";
import postRoutes from "./routes/postRoutes";
import logger from "./middleware/logger";
import authRoutes from "./routes/authRoutes";
import commentRoutes from "./routes/commentRoutes";
import adminRoutes from "./routes/adminRoutes";
import likeRoutes from "./routes/likeRoutes";
import errorMiddleware from "./middleware/errorMiddleware";
import authMiddleware from "./middleware/authMiddleware";

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

// Auth routes
app.use("/api/auth", authRoutes);

// Post routes
app.use("/api/posts", postRoutes);

// Comment routes (mounted under /api/posts so /:postId works)
app.use("/api/posts", commentRoutes);

// Like routes
app.use("/api/likes", likeRoutes);

// Admin routes
app.use("/api/admin", adminRoutes);

// Home route
app.get("/", (_req, res) => {
  res.send("Forum Backend Running");
});

// Test route (used in tests)
app.get("/api/test", (_req, res) => {
  res.status(200).json({ message: "Test route working" });
});

// Protected route example (used in tests)
app.get("/api/protected", authMiddleware, (_req, res) => {
  res.status(200).json({ message: "Protected route accessed" });
});

// Admin check route (used in tests)
app.get("/api/admin-check", authMiddleware, (req: any, res) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  return res.status(200).json({ message: "Admin access granted" });
});

app.use(errorMiddleware);

export default app;
