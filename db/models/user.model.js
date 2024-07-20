import { Schema, model } from "mongoose";
import { systemRoles } from "../../src/utils/systemRoles.js";

const userSchema = Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  recoveryEmail: {
    type: String,
    lowercase: true,
  },

  dateOfBirth: {
    type: Date,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: Object.values(systemRoles),
    default: "user",
  },
  status: {
    type: String,
    enum: ["online", "offline"],
    default: "offline",
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
});

const userModel = model("user", userSchema);

export default userModel;
