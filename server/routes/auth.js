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

const router = express.Router();

const upload = multer({ dest: "uploads/profiles/" });

router.post("/signup", signup);
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
