const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const {
  uploadProfilePhoto,
} = require('../controllers/uploadController');

// Upload profile photo
router.post(
  '/profile-photo',
  authMiddleware,
  upload.single('image'),
  uploadProfilePhoto
);

module.exports = router;