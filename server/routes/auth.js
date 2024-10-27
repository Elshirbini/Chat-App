import express from "express";
import {
  getUserInfo,
  login,
  signup,
  updateProfile,
  addProfileImage,
  deleteProfileImage,
  logout,
} from "../controllers/auth.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import multer from "multer";
import { body } from "express-validator";
import { User } from "../models/user.js";
const router = express.Router();

const upload = multer({ dest: "uploads/profiles/" });

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email ")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email has already exist");
          }
        });
      })
      .normalizeEmail(),
    body("password")
      .isLength({ min: 5, max: 10 })
      .withMessage("Password length should be from 5 to 10 chars")
      .matches(/[a-z]/)
      .withMessage("Password should be contains chars from a to z ")
      .matches(/[A-Z]/)
      .withMessage("Password should be contains chars from A to Z ")
      .matches(/[0-9]/)
      .withMessage("Password should be contains numbers ")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("Password should be contains special chars "),
  ],
  signup
);
router.post("/login", login);
router.get("/user-info", verifyToken, getUserInfo);
router.put("/update-profile", verifyToken, updateProfile);
router.post(
  "/add-profile-image",
  verifyToken,
  upload.single("profile-image"),
  addProfileImage
);
router.delete("/delete-profile-image", verifyToken, deleteProfileImage);
router.post("/logout", logout);

export const authRoutes = router;
