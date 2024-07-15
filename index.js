import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import userRouter from "./src/modules/user/user.routes.js";
import jobRouter from "./src/modules/job/job.routes.js";
import companyRouter from "./src/modules/company/company.routes.js";
import applicationRouter from "./src/modules/application/application.routes.js";
import connectionDB from "./db/connectionDB.js";
import { AppError } from "./src/utils/classError.js";
import { globalErrorHandling } from "./src/utils/globalErrorHandling.js";

const app = express();
const port = process.env.PORT || 3001;

connectionDB();

app.use(express.json());

app.use("/users", userRouter);

app.use("/jobs", jobRouter);

app.use("/companies", companyRouter);

app.use("/applications", applicationRouter);

app.use("*", (req, res, next) => {
  return next(new AppError(`invalid url ${req.originalUrl}`, 404));
});

app.use(globalErrorHandling);

app.listen(port, () => console.log(`app running on port ${port}`));
