import { Router } from "express";
import * as users from "./user.controller.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { signInValidation, signUpValidation } from "./user.validation.js";

const router = Router();

router.post("/registration", validation(signUpValidation), users.signUp);

router.post("/login", validation(signInValidation), users.signIn);

router.get("/profile", auth, users.getProfile);

router.get("/confirmEmail/:token", users.confirmEmail);

export default router;
