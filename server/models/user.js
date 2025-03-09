import { Schema, model } from "mongoose";

const user = new Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  firstName: String,
  lastName: String,
  image: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  color: Number,
  profileSetup: {
    type: Boolean,
    default: false,
  },
});

export const User = model("users", user);
