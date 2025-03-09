import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { getMessages, uploadFile } from "../controllers/messages.js";
import multer from "multer";
const router = express.Router();
const upload = multer({ dest: "uploads/files" });

router.use(verifyToken);
router.post("/get-messages", getMessages);
router.post("/upload-file", upload.single("file"), uploadFile);

export const messagesRoutes = router;
