import userModel from "../../db/models/user.model.js";
import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.status(400).json({ msg: "token not exist" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await userModel.findOne({ email: decoded.email });
  if (!user) {
    return res.status(409).json({ msg: "inValid user" });
  }
  req.user = user;
  next();
};
