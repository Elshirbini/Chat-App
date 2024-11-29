import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import nodemailer from "nodemailer";
import { cloudinary } from "../config/cloudinary.js";
import { ApiError } from "../utils/apiError.js";

const maxAge = 3 * 24 * 60 * 60 * 1000;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ahmedalshirbini33@gmail.com",
    pass: "rvgedkbbviilneor",
  },
});

export const signup = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ApiError(errors.array()[0].msg, 400);
  }

  // if (password.trim() !== confirmPassword.trim()) {
  //   throw new ApiError("Password and confirm password should be equal", 400);
  // }
  const mailOptions = {
    from: "ahmedalshirbini33@gmail.com",
    to: email,
    subject: "Welcome for you in my Syncronus Chat App",
    text: " Your account Created Successfully",
  };
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    email,
    password: hashedPassword,
  });

  const accessToken = jwt.sign({ user }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
  res.cookie("jwt", accessToken, {
    maxAge,
    secure: true,
    sameSite: "None",
  });
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  return res.status(201).json({
    user: {
      id: user._id,
      email: user.email,
      profileSetup: user.profileSetup,
    },
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError("Email and password is required", 401);
  }
  const user = await User.findOne({ email: email });
  if (!user) throw new ApiError("User not found", 404);

  const hashedPassword = await bcrypt.compare(password, user.password);
  if (!hashedPassword) throw new ApiError("Wrong password", 404);

  const accessToken = jwt.sign({ user }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
  res.cookie("jwt", accessToken, {
    maxAge,
    secure: true,
    sameSite: "None",
  });

  return res.status(200).json({
    user: {
      id: user._id,
      email: user.email,
      profileSetup: user.profileSetup,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
      color: user.color,
    },
  });
});

export const getUserInfo = asyncHandler(async (req, res, next) => {
  const { user } = req.user;

  const userData = await User.findById(user._id);
  if (!userData) throw new ApiError("User with the given id is not found", 404);

  return res.status(200).json({
    id: userData._id,
    email: userData.email,
    profileSetup: userData.profileSetup,
    firstName: userData.firstName,
    lastName: userData.lastName,
    image: userData.image,
    color: userData.color,
  });
});

export const updateProfile = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, color } = req.body;
  const { user } = req.user;

  if (!firstName || !lastName) {
    throw new ApiError("First name and  last name is required.", 400);
  }
  const userData = await User.findByIdAndUpdate(
    user._id,
    {
      firstName,
      lastName,
      color,
      profileSetup: true,
    },
    { new: true, runValidators: true }
  );

  if (!userData) throw new ApiError("User not found", 404);

  return res.status(200).json({
    id: userData._id,
    email: userData.email,
    profileSetup: userData.profileSetup,
    firstName: userData.firstName,
    lastName: userData.lastName,
    image: userData.image,
    color: userData.color,
  });
});

export const addProfileImage = asyncHandler(async (req, res, next) => {
  const { user } = req.user;
  const image = req.file.path;

  if (!req.file) throw new ApiError("File is required.", 400);

  const result = await cloudinary.uploader.upload(image, {
    folder: "ImageForChatUsers",
  });

  const userDoc = await User.findByIdAndUpdate(
    user._id,
    {
      image: { public_id: result.public_id, url: result.url },
    },
    { new: true, runValidators: true }
  );

  if (!userDoc) throw new ApiError("User not found", 404);

  return res.status(200).json({
    image: {
      public_id: userDoc.image.public_id,
      url: userDoc.image.url,
    },
  });
});

export const deleteProfileImage = asyncHandler(async (req, res, next) => {
  const { user } = req.user;

  const userData = await User.findByIdAndUpdate(
    user._id,
    {
      image: null,
    },
    { new: true, runValidators: true }
  );
  if (!userData) throw new ApiError("User not found", 404);
  
  cloudinary.uploader.destroy(userData.image.public_id);

  return res.status(200).json({ message: "Profile image has been deleted." });
});

export const logout = asyncHandler(async (req, res, next) => {
  res.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" });
  return res.status(200).send("Logout Successfully");
});
