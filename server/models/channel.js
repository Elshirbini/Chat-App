import mongoose from "mongoose";

const Schema = mongoose.Schema;

const channel = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    members: [{ type: mongoose.Types.ObjectId, ref: "users", required: true }],
    admin: { type: mongoose.Types.ObjectId, ref: "users", required: true },
    messages: [
      { type: mongoose.Types.ObjectId, ref: "messages", required: false },
    ],
  },
  { timestamps: true }
); 

export const Channel = mongoose.model("channels", channel);
