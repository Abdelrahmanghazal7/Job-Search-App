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
    description: joi.string().min(20).max(500).required(),
    industry: joi.string().min(2).max(50).required(),
    address: joi.string().min(2).max(200),
    numberOfEmployees: joi
      .string()
      .pattern(new RegExp(/^\d+\s*-\s*\d+$/))
      .required(),
    companyEmail: joi.string().email().required(),
  }),
};

export const updateCompanySchema = {
  body: joi.object({
    companyName: joi.string().min(2).max(15),
    description: joi.string().min(20).max(500),
    industry: joi.string().min(2).max(50),
    address: joi.string().min(2).max(200),
    numberOfEmployees: joi.string().pattern(new RegExp(/^\d+\s*-\s*\d+$/)),
    companyEmail: joi.string().email(),
    companyHR: joi.string().custom(objectIdValidator, "ObjectId validation"),
  }),
};
