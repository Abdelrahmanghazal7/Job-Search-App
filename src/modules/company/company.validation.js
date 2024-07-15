import joi from "joi";
import { ObjectId } from "bson";

const objectIdValidator = (value, helpers) => {
  if (!ObjectId.isValid(value)) {
    return helpers.message('must be a valid MongoDB ObjectId');
  }
  return value;
};

export const addCompanySchema = {
  body: joi.object({
    companyName: joi.string().min(2).max(15).required(),
    description: joi.string().min(10).max(100).required(),
    industry: joi.string().min(2).max(50).required(),
    address: joi.string().min(2).max(200),
    numberOfEmployees: joi
      .string()
      .pattern(new RegExp(/^(1[1-9]|20)$/))
      .messages({
        "string.pattern.base":
          "numberOfEmployees rang must be  11 to 20",
      })
      .required(),
    companyEmail: joi.string().email().required(),
  }),
};

export const updateCompanySchema = {
  body: joi.object({
    companyName: joi.string().min(2).max(15),
    description: joi.string().min(10).max(100),
    industry: joi.string().min(2).max(50),
    address: joi.string().min(2).max(200),
    numberOfEmployees: joi.string().pattern(new RegExp(/^(1[1-9]|20)$/))
    .messages({
      "string.pattern.base":
        "numberOfEmployees rang must be  11 to 20",
    }),
    companyEmail: joi.string().email(),
    companyHR: joi.string().custom(objectIdValidator, "ObjectId validation"),
  }),
};
