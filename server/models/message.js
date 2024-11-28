import { Schema, model } from "mongoose";


const message = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  recipient: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  messageType: {
    type: String,
    enum: ["text", "file"],
    required: true,
  },
  content: {
    type: String,
    required: function () {
      return this.messageType === "text";
    },
  },
  fileUrl: {
    type: String,
    required: function () {
      return this.messageType === "file";
    },
  },
  timestamp: {
    type: Date,
    default: Date.now(),
  },
});

export const Message = model("messages", message);
