import { Router } from "express";
import * as users from "./user.controller.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { signInValidation, signUpValidation, updatePasswordValidation, resetPasswordValidation } from "./user.validation.js";

const router = Router();

router.post("/signUp", validation(signUpValidation), users.signUp);

router.post("/signIn", validation(signInValidation), users.signIn);

router.get("/confirmEmail/:token", users.confirmEmail);

router.put('/update',auth, users.updateUser)

router.put('/updatePassword', auth, validation(updatePasswordValidation), users.updatePassword)

router.delete('/delete', auth, users.deleteUser)

router.get('/getOtherData/:id', auth, users.getUserData)

router.post('/forgetPassword/', validation(resetPasswordValidation), users.forgetPassword)

router.post('/recoveryEmail', auth, users.GetAllRecoveryEmail)

export default router;
