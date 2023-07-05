
const util = require("util");
const multer = require("multer");
const maxSize = 10 * 1024 * 1024;
const path = require("path");

// let storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/uploads/");
//   },
//   filename: (req, file, cb) => {
//     console.log(file.originalname);
//     cb(null, file.originalname);
//   },
// });

// let uploadFile = multer({
//   storage: storage,
//   fileFilter: (req, file, cb) => {
//     if (file = /json|keystore/) {
//       cb(null, true);
//     } else {
//       cb(null, false);
//       return cb(new Error('Only .json and .keystore format allowed!'));
//     }
//   },
//   limits: { fileSize: maxSize },
// }).single("file");
const storage = multer.diskStorage({
  destination: 'public/uploads/',
  filename: function(_req, file, cb){
    
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  } 
});
var uploadFile = multer({
  storage: storage,
  limits: {
      fields: 5,
      fieldNameSize: 50, // TODO: Check if this size is enough
      fieldSize: 20000, //TODO: Check if this size is enough
      // TODO: Change this line after compression
      fileSize: 15000000, // 150 KB for a 1080x1080 JPG 90
  },
  fileFilter: function(_req, file, cb){
      checkFileType(file, cb);
  }
}).single('file');
function checkFileType(file, cb){
// Allowed ext
const filetypes =/json|keystore/;
// Check ext
const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
// Check mime
// const mimetype = filetypes.test(file.mimetype);

if(extname){
  return cb(null,true);
} else {
  cb('Error: Only .json and .keystore format allowed!');
}
}
let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;