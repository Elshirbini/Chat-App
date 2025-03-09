import fs from "fs";
import asyncHandler from "express-async-handler";
import { Message } from "../models/message.js";
import { ApiError } from "../utils/apiError.js";

export const getMessages = asyncHandler(async (req, res, next) => {
  const { user } = req.user;
  const user1 = user._id;
  const user2 = req.body.id;

  if (!user1 || !user2) {
    throw new ApiError("Both user'ids are required.", 400);
  }
  const messages = await Message.find({
    $or: [
      { sender: user1, recipient: user2 },
      { sender: user2, recipient: user1 },
    ],
  }).sort({ timestamp: 1 });

  if (!messages || messages.length === 0) {
    throw new ApiError("No messages found", 404);
  }
  res.status(200).json({ messages });
});

export const uploadFile = asyncHandler(async (req, res, next) => {
  if (!req.file) throw new ApiError("File is required", 500);
  const date = new Date().toISOString();
  const fileDir = `uploads/files/${date}`;
  const fileName = `${fileDir}/${req.file.originalname}`;
  fs.mkdirSync(fileDir, { recursive: true });
  fs.renameSync(req.file.path, fileName);
  res.status(200).json({ filePath: fileName });
});
