import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  createChannel,
  geChannelMessages,
  getUserChannels,
} from "../controllers/channel.js";

const router = express.Router();


router.use(verifyToken);
router.post("/create-channel", createChannel);
router.get("/get-user-channels", getUserChannels);
router.get("/get-channel-messages/:channelId", geChannelMessages);

export const channelRoutes = router;
