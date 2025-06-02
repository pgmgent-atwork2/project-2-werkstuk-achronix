import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async (req, res, next) => {
  try {
    const userToken = req.cookies.token;

    if (!userToken) {
      return res.redirect("/login");
    }

    const userData = jwt.verify(userToken, process.env.TOKEN_SALT);

    if (!userData) {
      return res.redirect("/login");
    }

    const user = await User.query().findById(userData.userId);
    req.user = user;

    return next();
  } catch (e) {
    console.error("JWT Authentication Error:", e);
    res.redirect("/login");
  }
};
