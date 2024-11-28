import { Schema, model } from "mongoose";

const channel = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    members: [{ type: Schema.Types.ObjectId, ref: "users", required: true }],
    admin: { type: Schema.Types.ObjectId, ref: "users", required: true },
    messages: [{ type: Schema.Types.ObjectId, ref: "messages" }],
  },
  { timestamps: true }
);

export const Channel = model("channels", channel);
