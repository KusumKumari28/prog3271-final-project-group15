import express from "express";
import cors from "cors";
import postRoutes from "./routes/postRoutes";
import logger from "./middleware/logger";
import authRoutes from "./routes/authRoutes";
import commentRoutes from "./routes/commentRoutes";
import adminRoutes from "./routes/adminRoutes";
import errorMiddleware from "./middleware/errorMiddleware";

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/posts", commentRoutes);
// home route
app.get("/", (req, res) => {
  res.send("Forum Backend Running");
});

app.use("/api/admin", adminRoutes);
export default app;
import likeRoutes from "./routes/likeRoutes";
app.use("/api/likes", likeRoutes);
app.use(errorMiddleware);
