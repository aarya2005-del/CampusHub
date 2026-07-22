const errorMiddleware = (err, req, res, next) => {
  console.error('ERROR:', err);

  // Joi validation error
  if (err.isJoi) {
    return res.status(400).json({
      success: false,
      message: err.details[0].message,
    });
  }

  // Multer file upload error
  if (err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Generic error
  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

module.exports = errorMiddleware;