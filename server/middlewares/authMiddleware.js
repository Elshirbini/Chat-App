import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  let token;
  if (req.headers.cookie) {
    token = req.headers.cookie.split("jwt=")[1];
  }
  if (!token) return res.status(401).send("You are not authenticated!");
  jwt.verify(token, process.env.JWT_KEY, async (err, user) => {
    if (err) return res.status(401).send("Token is not valid!");
    req.user = user;
    next();
  });
};
