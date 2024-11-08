import { Message } from "../models/message.js";
import fs from "fs";

export const getMessages = async (req, res, next) => {
  try {
    const { user } = req.user;
    const user1 = user._id;
    const user2 = req.body.id;

    
    if (!user1 || !user2) {
      return res.status(400).send("Both user'ids are required.");
    }
    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timestamp: 1 });
    return res.status(200).json({ messages });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send("File is required");
    }
    const date = new Date().toISOString();
    const fileDir = `uploads/files/${date}`;
    const fileName = `${fileDir}/${req.file.originalname}`;
    fs.mkdirSync(fileDir, { recursive: true });
    fs.renameSync(req.file.path, fileName);
    return res.status(200).json({filePath : fileName});
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
