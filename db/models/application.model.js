import { Schema, model } from "mongoose";

const applicationSchema = Schema({
  jopId: {
    type: Schema.Types.ObjectId,
    ref: "job",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "company",
    required: true,
  },
  userTechSkills: {
    type: [String],
    required: true,
  },
  userSoftSkills: {
    type: [String],
    required: true,
  },
  userResumeUrl: {
    type: String,
    required: true,
  },
});

const applicationModel = model("application", applicationSchema);

export default applicationModel;
