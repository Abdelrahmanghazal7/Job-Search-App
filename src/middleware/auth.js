import userModel from "../../db/models/user.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/globalErrorHandling.js";

export const auth = (roles = []) => {
  return asyncHandler(async (req, res, next) => {
    const { token } = req.headers;

    if (!token) {
      return res.status(400).json({ msg: "token not exist" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.email) {
      return res.status(400).json({ msg: "invalid token payload" });
    }

    const user = await userModel.findOne({ email: decoded.email });
    if (!user) {
      return res.status(409).json({ msg: "user not exist" });
    }

    // authorization
    if (!roles.includes(user.role)) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    req.user = user;
    next();
  });
};
