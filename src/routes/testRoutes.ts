import express from "express";
import { testAPI } from "../controllers/testController";

const router = express.Router();

// simple test route
router.get("/test", testAPI);

export default router;
