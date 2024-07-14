import { Router } from "express";
import * as companies from "./company.controller.js";
import { auth } from "../../middleware/auth.js";
import role from "../../middleware/role.js";
import { validation } from "../../middleware/validation.js";
import { addCompanySchema, updateCompanySchema } from "./company.validation.js";

let roles = ['user', 'company_HR']
let router = Router()

router.post('/add',auth, role(["company_HR"]), validation(addCompanySchema), companies.addCompany);

router.get('/search',auth, role(roles), companies.companyWithName);

router.get('/applications',auth, role(["company_HR"]), companies.applications);

router.put('/update/:id',auth, role(["company_HR"]), validation(updateCompanySchema), companies.updateCompany);

router.delete('/delete/:id',auth, role(["company_HR"]), companies.deleteCompany);

router.get('/get/:id',auth, role(["company_HR"]), companies.getCompany);

export default router