import app from "./app";
import dotenv from "dotenv";
import { connectDB } from "./config/database";

dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI as string;

connectDB(MONGO_URI);

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
