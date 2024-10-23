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
