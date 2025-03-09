import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { ApiError } from "../utils/apiError.js";
import { configDotenv } from "dotenv";
configDotenv();


export const verifyToken = asyncHandler(async (req, res, next) => {
  let token;
  if (req.cookies["jwt"]) {
    token = req.cookies["jwt"];
  }

  if (!token) throw new ApiError("You are not authenticated.", 400);

  console.log(process.env.JWT_KEY);
  await jwt.verify(
    token,
    process.env.JWT_KEY,
    async (err, user) => {
      if (err) return next(new ApiError("Token is not valid", 401));
      req.user = user;
      next();
    }
  );
});
