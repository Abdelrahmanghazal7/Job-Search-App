import express from "express";
import userRouter from "./src/modules/user/user.routes.js";
import jobRouter from "./src/modules/job/job.controller.js";
import companyRouter from "./src/modules/company/company.controller.js";
import applicationRouter from "./src/modules/application/application.controller.js";
import connectionDB from "./db/connectionDB.js";
import { AppError } from "./src/utils/classError.js";
import { globalErrorHandling } from "./src/utils/globalErrorHandling.js";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

connectionDB();

app.use(express.json());

app.use("/user", userRouter);

app.use("/job", jobRouter);

app.use("/company", companyRouter);

app.use("/application", applicationRouter);

app.use("*", (req, res, next) => {
  return next(new AppError(`invalid url ${req.originalUrl}`, 404));
});

app.use(globalErrorHandling);

app.listen(port, () => console.log(`app running on port ${port}`));
