import express from "express"
import { verifyToken } from '../middlewares/authMiddleware.js';
import { getMessages } from "../controllers/messages.js";
const router = express.Router()

router.post("/get-messages" , verifyToken , getMessages )

export const messagesRoutes = router