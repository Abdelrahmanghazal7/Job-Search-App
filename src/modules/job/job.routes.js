import { Router } from "express";
import * as jobs from "./job.controller.js";
import { auth } from "../../middleware/auth.js";
import role from "../../middleware/role.js";
import { addJobSchema, updateJobSchema } from "./job.validation.js";
import { validation } from "../../middleware/validation.js";
import { multerHost } from "./cloudinary/multer.js";

let roles = ["user", "company_HR"];
let router = Router();

router.post( "/addJob", auth, role(["company_HR"]), validation(addJobSchema), jobs.addJob);

router.put( "/updateJob/:id", auth, role(["company_HR"]), validation(updateJobSchema), jobs.updateJob);

router.delete("/deleteJob/:id", auth, role(["company_HR"]), jobs.deleteJob);

router.get("/getAllJobs/", auth, role(roles), jobs.getAllJobs);

router.get("/getComapnyJobs/:id", auth, role(roles), jobs.getCompanyJobs);

router.get("/getFilteredJobs", auth, role(roles), jobs.getFilteredJobs);

router.post("/applayJob/:jobid", auth, role(["user"]), multerHost().single("cv"), jobs.applyJob);

export default router;
