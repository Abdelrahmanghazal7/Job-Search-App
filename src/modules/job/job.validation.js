import joi from "joi";
import { ObjectId } from "bson";

const objectIdValidator = (value, helpers) => {
  if (!ObjectId.isValid(value)) {
    return helpers.message("must be a valid MongoDB ObjectId");
  }
  return value;
};

export const addJobSchema = {
  body: joi.object({
    jobTitle: joi.string().required(),
    jobLocation: joi.string().valid("onsite", "remotely", "hybrid ").required(),
    workingTime: joi.string().valid("full-time", "part-time").required(),
    seniorityLevel: joi
      .string()
      .valid("junior", "Mid-Level", "Senior", "Team-Lead", "CTO")
      .required(),
    jobDescription: joi.string().min(5).max(1000).required(),
    technicalSkills: joi.array().items(joi.string().required()).required(),
    softSkills: joi.array().items(joi.string().required()).required(),
  }),
};

export const updateJobSchema = {
  body: joi.object({
    jobTitle: joi.string(),
    jobLocation: joi.string().valid("onsite", "remotely", "hybrid "),
    workingTime: joi.string().valid("full-time", "part-time"),
    seniorityLevel: joi
      .string()
      .valid("junior", "Mid-Level", "Senior", "Team-Lead", "CTO"),
    jobDescription: joi.string().min(5).max(1000),
    technicalSkills: joi.array().items(joi.string()),
    softSkills: joi.array().items(joi.string()),
    addedBy: joi.string().custom(objectIdValidator, "ObjectId validation"),
  }),
};

export const applyJobSchema = {
  body: joi.object({
    userSoftSkills: joi.array().items(joi.string().required()).required(),
    userTechSkills: joi.array().items(joi.string().required()).required(),
  }),

  params: joi.object({
    jobId: joi.string().custom(objectIdValidator, "ObjectId validation"),
  }),

  file: joi.object({
    asset_id: joi.string().required(),
    public_id: joi.string().required(),
    version: joi.number().required(),
    version_id: joi.string().required(),
    signature: joi.string().required(),
    resource_type: joi.string().required(),
    created_at: joi.string().required(),
    tags: joi.array().required(),
    bytes: 123067,
    type: joi.string().required(),
    etag: joi.string().required(),
    placeholder: false,
    url: joi.string().required(),
    secure_url: joi.string().required(),
    asset_folder: joi.string(),
    display_name: joi.string().required(),
    original_filename: joi.string().required(),
    api_key: joi.string().required(),
  }),
};
