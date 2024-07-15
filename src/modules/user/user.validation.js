import joi from "joi";

// Validation schema for sign up request

export const signUpValidation = {
  body: joi.object({
    firstName: joi.string().min(3).max(30).required(),
    lastName: joi.string().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi
      .string()
      .required()
      .pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/))
      .messages({
        "string.pattern.base":
          "Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      }),
    recoveryEmail: joi.string(),
    dateOfBirth: joi.date().iso().required(),
    mobileNumber: joi.number(),
    role: joi.string().valid("user", "company_HR").required(),
  }),
};

// Validation schema for login request

export const signInValidation = {
  body: joi.object({
    identifier: joi.string().email().required(),
    password: joi
      .string()
      .pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/))
      .messages({
        "string.pattern.base":
          "Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      })
      .required(),
  }),
};

// Validation schema for update password request

export const updatePasswordValidation = {
  body: joi.object({
    currentPassword: joi.string().required(),
    newPassword: joi
      .string()
      .pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/))
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
    email: joi.string().email().required(),
    newPassword: joi
      .string()
      .pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/))
      .required()
      .messages({
        "string.pattern.base":
          "Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      }),
  }),
};
