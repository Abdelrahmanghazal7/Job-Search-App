import userModel from "../../../db/models/userModel.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../../utils/globalErrorHandling.js";
import { AppError } from "../../utils/classError.js";

// =========================================== REGISTRATION ===========================================

const registration = async (req, res, next) => {
  const {
    username,
    email,
    password,
    recoveryEmail,
    DOB,
    mobileNumber,
    role,
    status,
  } = req.body;

  // Check if the user already exists
  const userExist = await userModel.findOne({ email });
  if (userExist) {
    return next(new AppError("user already exist", 400));
  }

  // Hash the password
  const hash = bcrypt.hashSync(password, 8);

  // Create a new user
  const user = await userModel.create({
    username,
    email,
    password: hash,
    recoveryEmail,
    DOB: new Date(DOB),
    mobileNumber,
    role,
    status,
  });

  res.status(200).json({ msg: "done", user });
};

export const signUp = asyncHandler(registration);

// =========================================== LOGIN ===========================================

const login = async (req, res, next) => {
  const { emailOrRecoveryEmailOrMobileNumber, password } = req.body;
  const user = await userModel.findOne({
    $or: [
      { email: emailOrRecoveryEmailOrMobileNumber },
      { recoveryEmail: emailOrRecoveryEmailOrMobileNumber },
      { mobileNumber: emailOrRecoveryEmailOrMobileNumber },
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
      id: userModel.id,
      email,
    },
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.status(200).json({ token });

  // Update user status to 'online'
  userModel.status = "online";
  await userModel.save();
};

export const signIn = asyncHandler(login);

// =========================================== UPDATE ===========================================

const update = async (req, res, next) => {

  const { id } = req.params;

  const { username, email, mobileNumber, recoveryEmail, DOB} =
    req.body;

    // Check if the updated email or mobileNumber already exists for another user
    if (email) {
      const existingUserWithEmail = await userModel.findOne({ email });
      if (existingUserWithEmail && existingUserWithEmail._id !== id) {
        return res.status(400).json({ error: "Email already exists." });
      }
    }

    if (mobileNumber) {
      const existingUserWithMobile = await userModel.findOne({ mobileNumber });
      if (existingUserWithMobile && existingUserWithMobile._id !== id) {
        return res.status(400).json({ error: "Mobile number already exists." });
      }
    }

    // Update user data
    const updatedFields = {};
    if (username) updatedFields.username = username;
    if (email) updatedFields.email = email;
    if (mobileNumber) updatedFields.mobileNumber = mobileNumber;
    if (recoveryEmail) updatedFields.recoveryEmail = recoveryEmail;
    if (DOB) updatedFields.DOB = new Date(DOB);

    const updatedUser = await userModel.findByIdAndUpdate({ _id: id }, updatedFields, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json(updatedUser);
};

export const updateUser = asyncHandler(update);

// =========================================== DELETE ===========================================

const deleteU = async (req, res, next) => {
  const { id } = req.params;

    // Delete user
    const deletedUser = await userModel.findByIdAndDelete({ _id: id });

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({ message: "User deleted successfully." });
};

export const deleteUser = asyncHandler(deleteU);

// =========================================== user account data ===========================================

router.get("/me", authMiddleware, async (req, res) => {
  const userId = req.userModel.id;

  try {
    // Fetch user data
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});



/**
 * Get profile data for another userModel.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
router.get("/profile/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    // Fetch user data by userId
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

/**
 * Update user password.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
router.put("/update-password", authMiddleware, async (req, res) => {
  const userId = req.userModel.id;
  const { currentPassword, newPassword } = req.body;

  try {
    // Fetch user by userId
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, userModel.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid current password." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    userModel.password = hashedPassword;
    await userModel.save();

    res.json({ message: "Password updated successfully." });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

/**
 * Forget password - Reset password.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
router.put("/forget-password", async (req, res) => {
  const { identifier, newPassword } = req.body;

  try {
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

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    userModel.password = hashedPassword;
    await userModel.save();

    res.json({ message: "Password updated successfully." });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

/**
 * Get all accounts associated to a specific recovery Email.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
router.get("/accounts-by-recovery-email", async (req, res) => {
  const { recoveryEmail } = req.query;

  try {
    // Find all users with the given recoveryEmail
    const users = await userModel.find({ recoveryEmail });

    if (!users || users.length === 0) {
      return res
        .status(404)
        .json({ error: "No accounts found with the provided recovery email." });
    }

    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
