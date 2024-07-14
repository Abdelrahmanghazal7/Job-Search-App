import { Schema, model } from "mongoose";

const companySchema = Schema({
  companyName: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  industry: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  numberOfEmployees: {
    type: String,
    required: true,
  },
  companyEmail: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  companyHR: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

const companyModel = model("company", companySchema);

export default companyModel;
