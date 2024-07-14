import multer from "multer";
import { AppError } from "../../../utils/classError.js";

export const multerHost = () => {
  const storage = multer.diskStorage({});
  const fileFilter = function (req, file, cb) {
    if (file.mimetype === "application/pdf") {
      return cb(null, true);
    }
    cb(new AppError("file not supported"), 500);
  };

  const upload = multer({ storage, fileFilter });
  return upload;
};
