import { Schema, model } from "mongoose";

const applicationSchema = Schema({
  jobId: { type: Schema.Types.ObjectId, ref: 'job', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  userTechSkills: [{ type: String }],
  userSoftSkills: [{ type: String }],
  userResumeUrl: { type: String }
});

const applicationModel = model("application", applicationSchema);

export default applicationModel;
