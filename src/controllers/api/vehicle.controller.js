const { Register, Vehicles } = require("../../sql-connections/models");
const { success, error, customResponse } = require("../../helpers/response/api-response.js");
const uploadFile = require("../../middlewares/uploads/uploads.js");
const { getVehicleResponseData } = require("../../helpers/response/parse-response.js");

exports.addDetails = [
    async (req, res) => {
      try {
        const { accountId, driverName, contactNum, fileDetail } = req.body;
  
        // Find the account with role 1
        const findAccount = await Register.findOne({
          where: { unique_role_id: accountId, role: 1 },
        });
  
        if (!findAccount) {
          customResponse(res, 1, "Account does not exist");
          return;
        }
  
        // Access the uploaded files from req.files
        const dlFilePath = req.files[0].path;
        const dPassportFilePath = req.files[1].path;
        const truckFilePath = req.files[2].path;
        const trailer1FilePath = req.files[3].path;
        const trailer2FilePath = req.files[4].path;
  
        // Create a new file entry and save data to Vehicles table
        const newVehicle = await Vehicles.create({
          account_id: accountId,
          driver_name: driverName,
          contact_num: contactNum,
          dl_file_path: dlFilePath,
          dl_num: fileDetail[0].dlNumber,
          dl_exp_date: fileDetail[0].dlExpiryDate,
          d_passport_file_path: dPassportFilePath,
          d_passport_num: fileDetail[1].dPassportNum,
          d_passport_exp_date: fileDetail[1].dPassportExpiryDate,
          truck_file_path: truckFilePath,
          truck_detail: fileDetail[2].truckDetail,
          trailer1_file: trailer1FilePath,
          trailer1_detail: fileDetail[3].trailer1Detail,
          trailer2_file: trailer2FilePath,
          trailer2_detail: fileDetail[4].trailer2Detail,
        });
  
        const responseVehicleData = await getVehicleResponseData(newVehicle);
  
        success(res, 200, "Details added successfully", responseVehicleData);
      } catch (err) {
        error(res, 500, err);
      }
    },
  ];
  


// const getVehicleResponseData = async function (vehicle) {
//     const responseVehicleData = {
//       accountId: vehicle.account_id,
//       driverName: vehicle.driver_name,
//       contactNum: vehicle.contact_num,
//       fileDetail: [
//         {
//           dlFilePath: vehicle.dl_file_path,
//           dlNumber: vehicle.dl_num,
//           dlExpiryDate: vehicle.dl_exp_date,
//         },
//         {
//           dPassportFilePath: vehicle.d_passport_file_path,
//           dPassportNum: vehicle.d_passport_num,
//           dPassportExpiryDate: vehicle.d_passport_exp_date,
//         },
//         {
//           truckFilePath: vehicle.truck_file_path,
//           truckDetail: vehicle.truck_detail,
//         },
//         {
//           trailer1FilePath: vehicle.trailer1_file,
//           trailer1Detail: vehicle.trailer1_detail,
//         },
//         {
//           trailer2FilePath: vehicle.trailer2_file,
//           trailer2Detail: vehicle.trailer2_detail,
//         },
//       ],
//     };
  
//     return responseVehicleData;
//   };