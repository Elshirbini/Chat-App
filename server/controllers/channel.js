import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import { Channel } from "../models/channel.js";
import { User } from "../models/user.js";
import { ApiError } from "../utils/apiError.js";

export const createChannel = asyncHandler(async (req, res, next) => {
  const { name, members } = req.body;
  const { user } = req.user;

  console.log("members", members);
  const admin = await User.findById(user._id);
  if (!admin) throw new ApiError("Admin user not found", 400);

  const validMembers = await User.find({ _id: { $in: members } });
  console.log("validMembers", validMembers);

  if (validMembers.length !== members.length) {
    throw new ApiError("Some members are not valid users", 400);
  }

  const newChannel = await Channel.create({
    name,
    members,
    admin: user._id,
  });

  res.status(201).json({ channel: newChannel });
});

export const getUserChannels = asyncHandler(async (req, res, next) => {
  const { user } = req.user;
  const userId = new mongoose.Types.ObjectId(user._id);
  const channels = await Channel.find({
    $or: [{ admin: userId }, { members: userId }],
  }).sort({ updatedAt: -1 });
  if (!channels) throw new ApiError("Channels not found.", 404);
  res.status(200).json({ channels });
});

export const geChannelMessages = asyncHandler(async (req, res, next) => {
  const { channelId } = req.params;
  const channel = await Channel.findById(channelId).populate({
    path: "messages",
    populate: {
      path: "sender",
      select: "firstName lastName email _id image color",
    },
  });
  if (!channel) throw new ApiError("Channel not found", 404);

  const messages = channel.messages;
  res.status(200).json({ messages });
});
