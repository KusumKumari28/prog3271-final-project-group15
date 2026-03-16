import express from "express";
import cors from "cors";
import testRoutes from "./routes/testRoutes";

const app = express();

app.use(cors());
app.use(express.json());

// home route
app.get("/", (req, res) => {
  res.send("Forum Backend Running");
});

// test api route
app.use("/api", testRoutes);

export default app;
