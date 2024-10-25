import mongoose from "mongoose";
import { Channel } from "../models/channel.js";
import { User } from "../models/user.js";

export const createChannel = async (req, res, next) => {
  try {
    const { name, members } = req.body;
    console.log("members", members);
    const { user } = req.user;
    const admin = await User.findById(user._id);
    if (!admin) {
      return res.status(400).send("Admin user not found.");
    }
    const validMembers = await User.find({ _id: { $in: members } });
    console.log("validMembers", validMembers);

    if (validMembers.length !== members.length) {
      return res.status(400).send("Some members are not valid users");
    }

    const newChannel = new Channel({
      name,
      members,
      admin: user._id,
    });
    newChannel.save();
    return res.status(201).json({ channel: newChannel });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getUserChannels = async (req, res, next) => {
  try {
    const { user } = req.user;
    const userId = new mongoose.Types.ObjectId(user._id);
    const channels = await Channel.find({
      $or: [{ admin: userId }, { members: userId }],
    }).sort({ updatedAt: -1 });
    return res.status(200).json({ channels });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const geChannelMessages = async (req, res, next) => {
  try {
    const { channelId } = req.params;
    const channel = await Channel.findById(channelId).populate({
      path: "messages",
      populate: {
        path: "sender",
        select: "firstName lastName email _id image color",
      },
    });
    if (!channel) {
      return res.status(404).send("Channel Not Found.");
    }
    const messages = channel.messages;
    return res.status(200).json({ messages });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
