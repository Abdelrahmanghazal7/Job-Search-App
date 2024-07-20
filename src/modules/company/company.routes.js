import { Router } from "express";
import * as companies from "./company.controller.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { addCompanySchema, updateCompanySchema } from "./company.validation.js";
import { systemRoles } from "../../utils/systemRoles.js";

let roles = ['user', 'company_HR']
let router = Router()

router.post('/add',auth([systemRoles.company_HR]), validation(addCompanySchema), companies.addCompany);

router.get('/search',auth([systemRoles.user, systemRoles.company_HR]), companies.companyWithName);

router.get('/applications',auth([systemRoles.company_HR]), companies.applications);

router.put('/update/:id',auth([systemRoles.company_HR]), validation(updateCompanySchema), companies.updateCompany);

router.delete('/delete/:id',auth([systemRoles.company_HR]), companies.deleteCompany);

router.get('/get/:id',auth([systemRoles.company_HR]), companies.getCompany);

export default router