import { Message } from "../models/message.js";

export const getMessages = async (req, res, next) => {
  const {user} = req.user
  const user1 = user._id;
  const user2 = req.body.id;
  try {
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
