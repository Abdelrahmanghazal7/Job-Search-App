import { Schema, model } from "mongoose";

const jobSchema = Schema({
  jobTitle: { type: String, required: true },
  jobLocation: { type: String, enum: ['onsite', 'remotely', 'hybrid'], required: true },
  workingTime: { type: String, enum: ['part-time', 'full-time'], required: true },
  seniorityLevel: { type: String, enum: ['Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO'], required: true },
  jobDescription: { type: String, required: true },
  technicalSkills: [{ type: String }],
  softSkills: [{ type: String }],
  addedBy: { type: Schema.Types.ObjectId, ref: 'user', required: true }
});

const jobModel = model("job", jobSchema);

export default jobModel;
