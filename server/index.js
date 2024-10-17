import express from "express";
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import { authRoutes } from "./routes/auth.js";
import { contactsRoutes } from "./routes/contacts.js";
import { setupSocket } from "./socket.js";
import { messagesRoutes } from "./routes/message.js";
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

app.use("/uploads/profiles", express.static("/uploads/profiles"));

app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages", messagesRoutes);

// const server = app.listen(PORT, () => {
//   console.log(`Server is running at port : ${PORT}`);
// });

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port : ${PORT}`);
    });
    setupSocket(server);
  })
  .catch((err) => console.log(err));
