import express from "express";
import cors from "cors";
import postRoutes from "./routes/postRoutes";
import logger from "./middleware/logger";
import authRoutes from "./routes/authRoutes";
import commentRoutes from "./routes/commentRoutes";

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

export default app;
