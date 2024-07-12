import { Schema, model } from "mongoose";

const userSchema = Schema({
  username: { type: String, required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  recoveryEmail: { type: String },
  DOB: { type: Date, required: true },
  mobileNumber: { type: String, unique: true },
  role: { type: String, enum: ["User", "Company_HR"], required: true },
  status: { type: String, enum: ["online", "offline"], default: "offline" },
});

const userModel = model("user", userSchema);

export default userModel;
