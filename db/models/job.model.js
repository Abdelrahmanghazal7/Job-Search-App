import { Schema, model } from "mongoose";

const jobSchema = Schema({
  jopTitle: {
    type: String,
    required: true,
  },
  jobLocation: {
    type: String,
    required: true,
    enum: ["onsite", "remotely", "hybrid"],
  },
  workingTime: {
    type: String,
    required: true,
    enum: ["part-time", "full-time"],
  },
  seniorityLevel: {
    type: String,
    required: true,
    enum: ["Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"],
  },
  jobDescription: {
    type: String,
    required: true,
  },
  technicalSkills: {
    type: [String],
    required: true,
  },
  softSkills: {
    type: [String],
    required: true,
  },
  addedBy: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: "company",
    required: true,
  },
});

const jobModel = model("job", jobSchema);

export default jobModel;
