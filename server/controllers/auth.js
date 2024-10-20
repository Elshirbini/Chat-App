import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import fs from "fs";

const maxAge = 3 * 24 * 60 * 1000;

export const signup = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password is required",
    });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      password: hashedPassword,
    });

    await user.save();

    const accessToken = jwt.sign({ user }, process.env.JWT_KEY, {
      expiresIn: maxAge,
    });
    res.cookie("jwt", accessToken, {
      maxAge,
      secure: true,
      sameSite: "None",
    });
    return res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password is required",
    });
  }

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const hashedPassword = await bcrypt.compare(password, user.password);

    if (!hashedPassword) {
      return res.status(404).json({
        message: "Wrong Password",
      });
    }

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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getUserInfo = async (req, res, next) => {
  const { user } = req.user;
  try {
    const userData = await User.findById(user._id);
    if (!userData) {
      return res.status(404).send("User with the given id is not found");
    }

    return res.status(200).json({
      id: userData._id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateProfile = async (req, res, next) => {
  const { firstName, lastName, color } = req.body;
  const { user } = req.user;
  try {
    if (!firstName || !lastName) {
      return res.status(400).send("First name and  last name is required.");
    }
    // const userData = User.findByIdAndUpdate(
    //   user._id,
    //   {
    //     firstName,
    //     lastName,
    //     color,
    //     profileSetup: true,
    //   },
    //   { new: true, runValidators: true }
    // );
    const userData = await User.findById(user._id);
    userData.firstName = firstName;
    userData.lastName = lastName;
    userData.color = color;
    userData.profileSetup = true;
    userData.save();

    return res.status(200).json({
      id: userData._id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const addProfileImage = async (req, res, next) => {
  const { user } = req.user;
  try {
    if (!req.file) {
      return res.status(400).send("File is required.");
    }

    const date = new Date().toISOString();
    const fileName = "uploads/profiles/" + date + req.file.originalname;

    fs.renameSync(req.file.path, fileName);
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { image: fileName },
      { new: true, runValidators: true }
    );
    return res.status(200).json({
      image: updatedUser.image,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const deleteProfileImage = async (req, res, next) => {
  const { user } = req.user;
  try {
    const userData = await User.findById(user._id);
    if (!userData) {
      return res.status(404).json("User not found");
    }

    if (userData.image) {
      fs.unlinkSync(userData.image);
    }
    userData.image = null;
    await userData.save();

    return res.status(200).send("Profile image has been deleted.");
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const logout = async(req,res,next) => {
  try {
    res.cookie('jwt' , '' , {maxAge : 1 , secure : true , sameSite:'None'})
    return res.status(200).send('Logout Successfully')
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}