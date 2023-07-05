
const { Register, FileUploadForAll } = require("../../sql-connections/models")

const { success, error, customResponse } = require("../../helpers/response/api-response.js");
const uploadFile = require("../../middlewares/uploads/uploads.js")
const { getFileResponseData } = require("../../helpers/response/parse-response.js")

// doc upload
exports.uploadFileForAll = [
  async (req, res) => {
    try {
      await uploadFile(req, res);
      const { accountId, documentType } = req.body;

      if (documentType) {
        const findAccountDetail = await Register.findOne({
          where: { unique_role_id: accountId, is_deleted: 0 },
        });

        if (findAccountDetail) {
          let fileDetails;
          if (
            documentType === "COI" ||
            documentType === "CR6" ||
            documentType === "CR5" ||
            documentType === "NATIONALID" ||
            documentType === "AGREEMENT"
          ) {
            fileDetails = await getFileResponseData(req.file, documentType);
          } else if (documentType === "TAX" || documentType === "INSURANCE" || documentType === "LICENSE") {
            const { expiryDate } = req.body;
            if (!expiryDate) {
              customResponse(res, 1, "Expiry date is required for TAX/INSURANCE/LICENSE documents");
              return;
            }

            fileDetails = await getFileResponseData(req.file, documentType, expiryDate);
          } else {
            customResponse(res, 1, "Please enter a correct document type");
            return;
          }

          const { path, filename, expiryDate } = fileDetails;

          // Find if a file with the same accountId and documentType already exists
          const existingFile = await FileUploadForAll.findOne({
            where: { account_id: accountId, document_type: documentType },
          });

          if (existingFile) {
            // Update the file details
            existingFile.file_name = filename;
            existingFile.file_path = path;
            await existingFile.save();

            const responseFileData = {
              accountId: accountId,
              documentType: documentType,
              path: existingFile.file_path,
              fileName: existingFile.file_name,
              expiryDate: existingFile.expiry_date
            };

            success(res, 200, "File updated successfully", responseFileData);
          } else {
            // Create a new file entry
            const newFile = await FileUploadForAll.create({
              account_id: accountId,
              document_type: documentType,
              file_name: filename,
              file_path: path,
              expiry_date: expiryDate,
            });

            const responseFileData = {
              accountId: accountId,
              documentType: documentType,
              path: newFile.file_path,
              fileName: newFile.file_name,
              expiryDate: newFile.expiry_date
            };

            success(res, 200, "File uploaded successfully", responseFileData);
          }
        } else {
          customResponse(res, 1, "Account not found");
        }
      } else {
        customResponse(res, 1, "Document type should not be empty!");
      }
    } catch (err) {
      error(res, 500, err);
    }
  },
];