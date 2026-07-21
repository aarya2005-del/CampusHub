const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

exports.uploadProfilePhoto = async (req, res) => {
  try {
    // Check file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image',
      });
    }

    // Get current user
    const currentUser = await User.findById(req.user.id);

    // Delete old image from Cloudinary if it exists
    if (currentUser.profilePhotoPublicId) {
      await cloudinary.uploader.destroy(
        currentUser.profilePhotoPublicId
      );
    }

    // Update user with new image
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        profilePhoto: req.file.path,
        profilePhotoPublicId: req.file.filename,
      },
      { new: true }
    ).select('-password');

    return res.status(200).json({
      success: true,
      message: 'Profile photo uploaded successfully',
      data: {
        user,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};