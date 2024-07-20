import applicationModel from "../../../db/models/application.model.js";
import { asyncHandler } from "../../utils/globalErrorHandling.js";
import xlsx from "xlsx";

export const getApps = asyncHandler(async (req, res, next) => {
  let apps = await applicationModel.find({});
  let formattedData = apps.map((doc) => {
    let result = {
      created_at: doc.createdAt,
      updated_at: doc.updatedAt,
      userResume: doc.userResume,
      _id : doc._id.toString(),
      jobId : doc.jobId.toString(),
      companyId : doc.companyId.toString(),
      userId : doc.userId.toString(),
      techSkills: doc.userTechSkills.join(", "),
      softSkills: doc.userSoftSkills.join(", "),
    };

    return result;
  });

  const ws = xlsx.utils.json_to_sheet(formattedData);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, "apps");
  const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });
  res.setHeader("Content-Disposition", "attachment; filename=output.xlsx");
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
   res.send(buffer).json({ msg: "done" });
});
