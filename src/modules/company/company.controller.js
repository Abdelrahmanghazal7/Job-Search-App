import companyModel from "../../../db/models/company.model.js";
import jopModel from "../../../db/models/job.model.js";
import applicationModel from "../../../db/models/application.model.js";
import { AppError } from "../../utils/classError.js";
import { asyncHandler } from "../../utils/globalErrorHandling.js";

// =========================================== ADD COMPANY ===========================================

export const addCompany = asyncHandler(async (req, res, next) => {
  req.body.companyHR = req.user._id;
  const company = await companyModel.create(req.body);
  return res.status(201).json({ msg: "Company added successfully", company });
});

// =========================================== UPDATE COMPANY ===========================================

export const updateCompany = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const company = await companyModel.findById(id);
  if (!company) {
    return next(new AppError("Company not found", 404));
  }
  if (company.companyHR.toString() != req.user._id) {
    return next(new AppError("unauthrezied", 401));
  }
  const update = await companyModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  return res.status(200).json({ msg: "Company updated successfully", update });
});

// =========================================== DELETE COMPANY ===========================================

export const deleteCompany = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const company = await companyModel.findById(id);
  if (!company) {
    return next(new AppError("Company not found", 404));
  }
  if (company.companyHR.toString() != req.user._id) {
    return next(new AppError("unauthrezied", 401));
  }
  const deleteC = await companyModel.findByIdAndDelete(id, req.body, {
    new: true,
  });
  await jopModel.deleteMany({ company: company.id }); // delete related jops
  return res.status(200).json({ msg: "Company deleted successfully", deleteC });
});

// =========================================== GET COMPANY ===========================================

export const getCompany = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const company = await companyModel.findById(id);
  if (!company) {
    return next(new AppError("Company not found", 404));
  }

  if (company.companyHR.toString() != req.user._id) {
    return next(new AppError("unauthrezied", 401));
  }

  const jops = await jopModel.find({ addedBy: company.companyHR });
  return res.status(200).json({ msg: "done", company, jops });
});

// =========================================== GET COMPANY BY NAME ===========================================

export const companyWithName = asyncHandler(async (req, res, next) => {
  const { name } = req.query;
  const company = await companyModel.find({});
  const companies = company.filter((c) =>
    c.companyName.toLowerCase().includes(name.toLowerCase())
  );
  res.status(200).json({ msg: "Company", companies });
});

// =========================================== GET APPLICATIONS ===========================================

export const applications = asyncHandler(async (req, res, next) => {
  const company = await companyModel.findOne({ companyHR: req.user._id });
  const applications = await applicationModel
    .find({ combanyId: company._id })
    .populate("userId");
  res.status(200).json({ msg: "Applications", applications });
});
