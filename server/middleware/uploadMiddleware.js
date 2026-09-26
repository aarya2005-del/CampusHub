const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const memoryUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

const uploadToCloudinary = (req, res, next) => {
  memoryUpload.single("image")(req, res, (error) => {
    if (error) {
      return next(error);
    }

    if (!req.file) {
      return next();
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "campushub",
        resource_type: "image",
        transformation: [
          {
            width: 500,
            height: 500,
            crop: "limit",
          },
        ],
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
  single: () => uploadToCloudinary,
};