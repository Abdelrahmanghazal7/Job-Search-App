import { Schema, model } from "mongoose";

const applicationSchema = Schema({
  jobId: {
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
  userResume: {
    secure_url: String,
    public_id: String,
  },
});

const applicationModel = model("application", applicationSchema);

export default applicationModel;
