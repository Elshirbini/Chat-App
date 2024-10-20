import mongoose from "mongoose";
import { User } from "../models/user.js";
import { Message } from "../models/message.js";

export const searchContacts = async (req, res, next) => {
  try {
    const { searchTerm } = req.body;
    const { user } = req.user;

    const sanitizedSearchTerm = searchTerm.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );
    const regEx = new RegExp(sanitizedSearchTerm, "i");
    const contacts = await User.find({
      $and: [
        { _id: { $ne: user._id } },
        {
          $or: [{ firstName: regEx }, { lastName: regEx }, { email: regEx }],
        },
      ],
    });
    return res.status(200).json({ contacts });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getContactForDMList = async (req, res, next) => {
  try {
    const { user } = req.user;
    const userId = new mongoose.Types.ObjectId(user._id);
    const contacts = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] },
              then: "$recipient",
              else: "$sender",
            },
          },
          lastMessageTime: { $first: "$timestamp" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "profile",
        },
      },
      {
        $unwind: "$profile",
      },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: "$profile.email",
          firstName: "$profile.firstName",
          lastName: "$profile.lastName",
          image: "$profile.image",
          color: "$profile.color",
        },
      },
      {
        $sort: { lastMessageTime: -1 },
      },
    ]);

    return res.status(200).json({ contacts });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getAllContacts = async (req, res, next) => {
  try {
    const { user } = req.user;
    const users = await User.find(
      { _id: { $ne: user._id } },
      "firstName lastName _id email"
    );

    const contacts = users.map((user) => ({
      label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
    }));
    return res.status(200).json({ contacts });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
