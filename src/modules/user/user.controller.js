import userModel from "../../../db/models/user.model.js";
import companyModel from "../../../db/models/company.model.js";
import jopModel from "../../../db/models/job.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../service/sendEmail.js";
import { asyncHandler } from "../../utils/globalErrorHandling.js";
import { AppError } from "../../utils/classError.js";

// =========================================== REGISTRATION ===========================================

const registration = async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    recoveryEmail,
    dateOfBirth,
    mobileNumber,
    role,
  } = req.body;

  // Check if the user already exists
  const userExist = await userModel.findOne({
    $or: [{ email }, { recoveryEmail }],
  });
  if (userExist) {
    return next(new AppError("user already exist", 400));
  }

  // Send email to confirm signing
  const token = jwt.sign({ email }, process.env.JWT_SECRET);
  const link = `http://localhost:3000/users/confirmEmail/${token}`;

  const checkSendEmail = await sendEmail(
    email,
    "hi",
    `<a href=${link}>Confirm Email</a>`
  );
  if (!checkSendEmail) {
    return next(new AppError("email not send", 400));
  }

  // Hash the password
  const hash = bcrypt.hashSync(password, Number(process.env.SALT_ROUNDS));

  // Create a new user
  const user = await userModel.create({
    firstName,
    lastName,
    username: firstName + " " + lastName,
    email,
    password: hash,
    recoveryEmail,
    dateOfBirth: new Date(dateOfBirth),
    mobileNumber,
    role,
  });

  res.status(200).json({ msg: "done", user });
};

export const signUp = asyncHandler(registration);

// =========================================== CONFIRM EMAIL ===========================================

const confirm = async (req, res, next) => {
  const { token } = req.params;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded?.email) {
    return next(new AppError("invalid payload", 400));
  }
  const user = await userModel.findOneAndUpdate(
    { email: decoded.email, confirmed: false },
    { confirmed: true },
    { new: true }
  );
  if (!user) {
    return next(new AppError("user not found or already confirmed", 400));
  }
  res.status(200).json({ msg: "done", user });
};

export const confirmEmail = asyncHandler(confirm);

// =========================================== LOGIN ===========================================

const login = async (req, res, next) => {
  const { identifier, password } = req.body;
  const user = await userModel.findOne({
    $or: [
      { email: identifier },
      { recoveryEmail: identifier },
      { mobileNumber: identifier },
    ],
  });

  // Check if user exist
  if (!user) {
    return next(new AppError("invaild user", 409));
  }

  // Compare passwords
  if (!bcrypt.compareSync(password, userModel.password)) {
    return next(new AppError("password incorrect", 400));
  }

  // Generate JWT token
  const payload = {
    user: {
      id: user._id,
      email,
    },
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  res.status(200).json({ token });

  // Update user status to 'online'
  await userModel.findOneAndUpdate({ email: user.email }, { status: "online" });
};

export const signIn = asyncHandler(login);

// =========================================== UPDATE USER ===========================================

const update = async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    mobileNumber,
    recoveryEmail,
    dateOfBirth,
  } = req.body;

  const emailExist = await userModel.findOne({ email });
  if (emailExist) {
    next(new AppError("Email already exists", 400));
  }

  const mobileExist = await userModel.findOne({ mobileNumber });
  if (mobileExist) {
    next(new AppError("Mobile Number already exists", 400));
  }

  const data = await userModel.findByIdAndUpdate(
    req.user.id,
    {
      firstName,
      lastName,
      email,
      mobileNumber,
      recoveryEmail,
      dateOfBirth: new Date(dateOfBirth),
    },
    { new: true }
  );
  if (!data) {
    next(new AppError("User not found", 404));
  }

  return res.status(200).json({ msg: "done", data });
};

export const updateUser = asyncHandler(update);

// =========================================== DELETE USER ===========================================

export const deleteUser = asyncHandler(async (req, res, next) => {
  const deletedUser = await userModel.findByIdAndDelete(req.user.id);

  if (!deletedUser) {
    return res.status(404).json({ error: "User not found." });
  }

  if (user.role == "company_HR") {
    await companyModel.findOneAndDelete({ companyHR: user.id }); // delete his company
    await jopModel.deleteMany({ addedBy: req.user.id }); // delete related jobs
  }

  res.json({ message: "User deleted successfully." });
});

// =========================================== GET USER DATA ===========================================

export const getUserData = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Fetch user data
  const user = await userModel.findById({ _id: id });

  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  res.json(user);
});

// =========================================== UPDATE PASSWORD ===========================================

export const updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  // Fetch user by userId
  const user = await userModel.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  // Check current password
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid current password." });
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password
  req.user.password = hashedPassword;
  await req.user.save();

  res.json({ message: "Password updated successfully." });
});

// =========================================== FORGET PASSWORD ===========================================

export const forgetPassword = asyncHandler(async (req, res, next) => {
  const { identifier, newPassword } = req.body;

  // Find user by email, recoveryEmail, or mobileNumber
  let user = await userModel.findOne({
    $or: [
      { email: identifier },
      { recoveryEmail: identifier },
      { mobileNumber: identifier },
    ],
  });

  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  await userModel.findOneAndUpdate(
    {
      $or: [
        { email: identifier },
        { recoveryEmail: identifier },
        { mobileNumber: identifier },
      ],
    },
    { confirmed: false },
    { new: true }
  );

  // Send email to confirm signing
  const token = jwt.sign({ email }, process.env.JWT_SECRET);
  const link = `http://localhost:3000/users/confirmEmail/${token}`;

  const checkSendEmail = await sendEmail(
    email,
    "hi",
    `<a href=${link}>Confirm Email</a>`
  );
  if (!checkSendEmail) {
    return next(new AppError("email not send", 400));
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password
  req.user.password = hashedPassword;
  await req.user.save();

  res.json({ message: "Password reset successfully." });
});

// =========================================== GET ALL USERS RECOVERY EMAIL ===========================================

export const GetAllRecoveryEmail = asyncHandler(async (req, res, next) => {
  const { recoveryEmail } = req.body;

  // Find all users with the given recoveryEmail
  const users = await userModel.find({ recoveryEmail });

  if (!users || users.length === 0) {
    return res
      .status(400)
      .json({ error: "No accounts found with the provided recovery email." });
  }

  res.status(200).json(users);
});
