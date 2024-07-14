import { Router } from "express";
import { getApps } from "./application.controller.js";

const router = Router();

router.get("/getApps", getApps);

export default router;
