import multer from "multer";

const storage = multer.memoryStorage();

const fileUpload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "text/plain",
      "application/zip",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("This file type is not allowed."));
    }
  }
});

export default fileUpload;