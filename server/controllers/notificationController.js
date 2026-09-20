const Notification = require("../models/Notification");

// Get logged-in user's notifications
exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id,
    })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      user: req.user.id,
      isRead: false,
    });

    return res.status(200).json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Mark one notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      {
        isRead: true,
      },
      {
        new: true,
      }
    );

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        user: req.user.id,
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    return res.status(200).json({
      message: "All notifications marked as read",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};