import massageModel from "../../../db/models/massage.model.js";
import { asyncHandler } from "../../utils/globalErrorHandling.js";
import { AppError } from "../../utils/classError.js";

// =========================================== ADD MASSAGE ===========================================

const addMsge = async (req, res, next) => {
  const { content } = req.body;
  const massage = await massageModel.create({
    content,
    receiverId: req.user.id,
  });
  return res.status(201).json({ msg: "done", massage });
};

export const addMassage = asyncHandler(addMsge);

// =========================================== GET MASSAGES ===========================================

const getMsges = async (req, res, next) => {
  const massages = await massageModel.find({});
  return res.status(200).send(massages);
};

export const getMassages = asyncHandler(getMsges);

// =========================================== DELETE MASSAGE ===========================================

const deleteMsge = async (req, res, next) => {
  const { id } = req.params;
  const massage = await massageModel.findByIdAndDelete({ _id: id });
  if (!massage) {
    return next(
      new AppError("massage not found or you are not authorized", 400)
    );
  }
  return res.status(200).json({ msg: "Deleted" });
};

export const deleteMassage = asyncHandler(deleteMsge);
