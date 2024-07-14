import joi from "joi";

// Validation schema for sign up request

export const signUpValidation = {
  body: joi.object({
    username: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    recoveryEmail: joi.string(),
    DOB: joi.date().iso().required(),
    mobileNumber: joi.number(),
    role: joi.string().valid("User", "Company_HR").required(),
    status: joi.string().valid("online", "offline"),
  }),
};

// Validation schema for login request

export const signInValidation = {
  body: joi.object({
    email: joi.string().email().required(),
    password: joi
      .string()
      .pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/))
      .required(),
  }),
};

// Validation schema for update password request

export const updatePasswordValidation = {
  body: joi.object({
    currentPassword: joi.string().required(),
    newPassword: joi
      .string()
      .min(8)
      .pattern(
        new RegExp(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        )
      )
      .required()
      .messages({
        "string.pattern.base":
          "Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      }),
  }),
};

// Validation schema for reset password request

export const resetPasswordValidation = {
  body: joi.object({
    password: joi
      .string()
      .min(8)
      .pattern(
        new RegExp(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        )
      )
      .required()
      .messages({
        "string.pattern.base":
          "Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      }),
  }),
};
