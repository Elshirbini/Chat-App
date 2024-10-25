import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  createChannel,
  geChannelMessages,
  getUserChannels,
} from "../controllers/channel.js";

const router = express.Router();

router.post("/create-channel", verifyToken, createChannel);
router.get("/get-user-channels", verifyToken, getUserChannels);
router.get("/get-channel-messages/:channelId", verifyToken, geChannelMessages);

export const channelRoutes = router;
