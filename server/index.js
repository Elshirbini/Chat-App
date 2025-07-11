import express from "express";
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import compression from "compression";
import { authRoutes } from "./routes/auth.js";
import { contactsRoutes } from "./routes/contacts.js";
import { setupSocket } from "./socket.js";
import { messagesRoutes } from "./routes/message.js";
import { channelRoutes } from "./routes/channel.js";
import { ApiError } from "./utils/apiError.js";
import { errorHandling } from "./middlewares/errorHandling.js";
import helmet from "helmet";
configDotenv();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(compression());
app.use("/uploads/files", express.static("uploads/files"));

app.use(cookieParser());
app.use(express.json());

app.use(helmet());
app.use(mongoSanitize());
const apiLimiter = rateLimit({
  max: 300,
  windowMs: 15 * 60 * 1000,
  message: "Too many requests from this IP, please try again after 15 minutes!",
});

const loginLimiter = rateLimit({
  max: 20,
  windowMs: 15 * 60 * 1000,
  message:
    "Too many login attempts from this IP, please try again after 15 minutes!",
});

app.use("/api", apiLimiter);
app.use("/api/auth", loginLimiter);

//                         **  ROUTES **

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/channel", channelRoutes);

app.use((req, res, next) => {
  const error = new ApiError(`Can't find this route: ${req.originalUrl}`, 404);
  next(error);
});

app.use(errorHandling);

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port : ${PORT}`);
    });
    setupSocket(server);
  })
  .catch((err) => console.log(err));
