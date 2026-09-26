const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only PDF, JPG, PNG, and WEBP files are allowed"
      ),
      false
    );
  }
};

const memoryUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const assignmentUpload = (req, res, next) => {
  memoryUpload.single("file")(req, res, (error) => {
    if (error) {
      return next(error);
    }

    if (!req.file) {
      return next();
    }

    const isPdf = req.file.mimetype === "application/pdf";

    const originalName = req.file.originalname
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "-");

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "campushub/assignments",
        resource_type: isPdf ? "raw" : "image",
        public_id: `${Date.now()}-${originalName}`,
      },
      (uploadError, result) => {
        if (uploadError) {
          return next(uploadError);
        }

        req.file.path = result.secure_url;
        req.file.filename = result.public_id;

        next();
      }
    );

    uploadStream.end(req.file.buffer);
  });
};

module.exports = {
  single: () => assignmentUpload,
};