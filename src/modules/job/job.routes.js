import { Router } from "express";
import * as jobs from "./job.controller.js";
import { auth } from "../../middleware/auth.js";
import { addJobSchema, updateJobSchema } from "./job.validation.js";
import { validation } from "../../middleware/validation.js";
import { multerHost, validExtension } from "../../service/multer.js";
import { systemRoles } from "../../utils/systemRoles.js";

let roles = ["user", "company_HR"];
let router = Router();

router.post( "/add", auth([systemRoles.company_HR]), validation(addJobSchema), jobs.addJob);

router.put( "/update/:id", auth([systemRoles.company_HR]), validation(updateJobSchema), jobs.updateJob);

router.delete("/delete/:id", auth([systemRoles.company_HR]), jobs.deleteJob);

router.get("/all", auth([systemRoles.user, systemRoles.company_HR]), jobs.getAllJobs);

router.get("/company/:id", auth([systemRoles.user, systemRoles.company_HR]), jobs.getCompanyJobs);

router.get("/filter", auth([systemRoles.user, systemRoles.company_HR]), jobs.getFilteredJobs);

router.post("/apply/:jobId", auth([systemRoles.user]), multerHost(validExtension.pdf).single("cv"), jobs.applyJob);

export default router;
