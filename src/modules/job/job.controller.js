import applicationModel from "../../../db/models/application.model.js";
import companyModel from "../../../db/models/company.model.js";
import jobModel from "../../../db/models/job.model.js";
import { AppError } from "../../utils/classError.js";
import { asyncHandler } from "../../utils/globalErrorHandling.js";
import cloudinary from "./cloudinary/cloudinary.js";

// =========================================== ADD JOB ===========================================

export const addJob = asyncHandler(async (req, res, next) => {
  req.body.addedBy = req.user._id;
  const company = await companyModel.findOne({ companyHR: req.user._id });
  if (!company) return next(new AppError("Couldn't find company", 404));
  req.body.company = company._id;
  const newJob = await jobModel.create(req.body);
  return res.status(201).json(newJob);
});

// =========================================== UPDATE JOB ===========================================

export const updateJob = asyncHandler(async (req, res, next) => {
  const {id} = req.params;
  const newJob = await jobModel.findByIdAndUpdate(id, req.body, { new: true });
  return res.status(201).json(newJob);
});

// =========================================== DELETE JOB ===========================================

export const deleteJob = asyncHandler(async (req, res, next) => {
  const {id} = req.params;
  const job = await jobModel.findByIdAndDelete(id);
  return res.status(201).json("job deleted");
});

// =========================================== GET ALL JOBS ===========================================

export const getAllJobs = asyncHandler(async (req, res, next) => {
  const jobs = await jobModel.find({}).populate("company");
  return res.status(201).json(jobs);
});

// =========================================== GET COMPANY JOBS ===========================================

export const getCompanyJobs = asyncHandler(async (req, res, next) => {
  const companyId = req.params.id;
  const jobs = await jobModel.find({ company: companyId }).populate("company");
  return res.status(201).json(jobs);
});

// =========================================== GET FILTERED JOB ===========================================

export const getFilteredJobs = asyncHandler(async (req, res, next) => {
  const {title} = req.query;
  const job = await jobModel.find({});
  const jobs = job.filter((j) =>
    j.jopTitle.toLowerCase().includes(title.toLowerCase())
  );

  if (jobs.length < 1) return next(new AppError("Couldn't find jobs", 404));

  return res.status(201).json(jobs);
});

// =========================================== APPLY JOB ===========================================

export const applyJob = asyncHandler(async (req, res, next) => {

  const { userTechSkills, userSoftSkills } = req.body;
  const {jobId} = req.params;
  const userId = req.user._id;
  const job = await jobModel.findById(jobId);
  const companyId = job.company;

  const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path, {
    folder: "cvs",
    resource_type: 'raw',
  });
  
  if (!req.file) {
    return next(new AppError("no file uploaded", 400))
  }

  const application = await applicationModel.create({
    jobId,
    userId,
    companyId,
    userTechSkills,
    userSoftSkills,
    userResume: {secure_url, public_id}
  });
  
  return res.status(201).json({ msg: "done", application });
});
