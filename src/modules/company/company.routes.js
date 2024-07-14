import { Router } from "express";
import * as companies from "./company.controller.js";
import { auth } from "../../middleware/auth.js";
import role from "../../middleware/role.js";
import { validation } from "../../middleware/validation.js";
import { addCompanySchema, updateCompanySchema } from "./company.validation.js";

let roles = ['user', 'company_HR']
let router = Router()

router.post('/addCompany',auth, role(["company_HR"]), validation(addCompanySchema), companies.addCompany);

router.get('/companyWithName',auth, role(roles), companies.companyWithName);

router.get('/applications',auth, role(["company_HR"]), companies.applications);

router.put('/updateCompany/:id',auth, role(["company_HR"]), validation(updateCompanySchema), companies.updateCompany);

router.delete('/deleteCompany/:id',auth, role(["company_HR"]), companies.deleteCompany);

router.get('/getCompany/:id',auth, role(["company_HR"]), companies.getCompany);

export default router