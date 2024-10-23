import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { createChannel } from "../controllers/channel.js";

const router = express.Router();

router.post("/create-channel", verifyToken, createChannel);

export const channelRoutes = router;
