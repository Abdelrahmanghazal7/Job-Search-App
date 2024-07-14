import { Router } from "express";
import * as jobs from "./job.controller.js";
import { auth } from "../../middleware/auth.js";
import role from "../../middleware/role.js";
import { addJobSchema, updateJobSchema } from "./job.validation.js";
import { validation } from "../../middleware/validation.js";
import { multerHost } from "./cloudinary/multer.js";

let roles = ["user", "company_HR"];
let router = Router();

router.post( "/add", auth, role(["company_HR"]), validation(addJobSchema), jobs.addJob);

router.put( "/update/:id", auth, role(["company_HR"]), validation(updateJobSchema), jobs.updateJob);

router.delete("/delete/:id", auth, role(["company_HR"]), jobs.deleteJob);

router.get("/all", auth, role(roles), jobs.getAllJobs);

router.get("/comapny/:id", auth, role(roles), jobs.getCompanyJobs);

router.get("/filter", auth, role(roles), jobs.getFilteredJobs);

router.post("/applay/:jobid", auth, role(["user"]), multerHost().single("cv"), jobs.applyJob);

export default router;
