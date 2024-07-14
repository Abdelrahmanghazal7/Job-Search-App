import applicationModel from "../../../db/models/application.model.js";
import companyModel from "../../../db/models/company.model.js";
import jobModel from "../../../db/models/job.model.js";
import { AppError } from "../../utils/classError.js";
import { asyncHandler } from "../../utils/globalErrorHandling.js";
import cloudinary from "./cloudinary/cloudinary.js";

// =========================================== ADD JOB ===========================================

export const addJob = asyncHandler(async (req, res, next) => {
  req.body.addedBy = req.user._id;
  let company = await companyModel.findOne({ companyHR: req.user._id });
  if (!company) return next(new AppError("Couldn't find company", 404));
  req.body.company = company._id;
  const newJob = await jobModel.create(req.body);
  return res.status(201).json(newJob);
});

// =========================================== UPDATE JOB ===========================================

export const updateJob = asyncHandler(async (req, res, next) => {
  let id = req.params.id;
  const newJob = await jobModel.findByIdAndUpdate(id, req.body, { new: true });
  return res.status(201).json(newJob);
});

// =========================================== DELETE JOB ===========================================

export const deleteJob = asyncHandler(async (req, res, next) => {
  let id = req.params.id;
  const job = await jobModel.findByIdAndDelete(id);
  return res.status(201).json(job);
});

// =========================================== GET ALL JOBS ===========================================

export const getAllJobs = asyncHandler(async (req, res, next) => {
  const jobs = await jobModel.find({}).populate("company");
  return res.status(201).json(jobs);
});

// =========================================== ADD COMPANY JOBS ===========================================

export const getCompanyJobs = asyncHandler(async (req, res, next) => {
  let companyId = req.params.id;
  const jobs = await jobModel.find({ company: companyId }).populate("company");
  return res.status(201).json(jobs);
});

// =========================================== GET FILTERED JOB ===========================================

export const getFilteredJobs = asyncHandler(async (req, res, next) => {
  let query = req.query;
  const jobs = await jobModel.find(query);
  return res.status(201).json(jobs);
});

// =========================================== APPLY JOB ===========================================

export const applyJob = asyncHandler(async (req, res, next) => {
  let jobId = req.params.jobid;
  let userId = req.user._id;
  let job = await jobModel.findById(jobId);
  let companyId = job.company;
  let data = await cloudinary.uploader.upload(req.file.path, {
    folder: "cvs",
    resource_type: "raw",
  });
  let userResume = data.secure_url;
  let { userTechSkills, userSoftSkills } = req.body;
  const application = await applicationModel.create({
    jobId,
    companyId,
    userId,
    userTechSkills,
    userSoftSkills,
    userResume,
  });
  return res.status(201).json({ msg: "done", application });
});
