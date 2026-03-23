import express from "express";
import cors from "cors";
import testRoutes from "./routes/testRoutes";
import logger from "./middleware/logger";
import authRoutes from "./routes/authRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use(logger);

// home route
app.get("/", (req, res) => {
  res.send("Forum Backend Running");
});

// test api route
app.use("/api", testRoutes);

export default app;
