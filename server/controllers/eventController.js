const Event = require("../models/Event");

// Create Event
exports.createEvent = async (req, res) => {
  try {
    const { title, description, location, eventDate } = req.body;

    if (!title || !description || !location || !eventDate) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    const event = await Event.create({
      title,
      description,
      location,
      eventDate,
      createdBy: req.user.id,
    });

    return res.status(201).json({
      message: "Event created successfully",
      event,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("createdBy", "name email role")
      .sort({ eventDate: 1 });

    return res.status(200).json({
      events,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Get Event By ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("createdBy", "name email role");

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    return res.status(200).json({
      event,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Update Event
exports.updateEvent = async (req, res) => {
  try {
    const { title, description, location, eventDate } = req.body;

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        location,
        eventDate,
      },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    return res.status(200).json({
      message: "Event updated successfully",
      event,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    return res.status(200).json({
      message: "Event deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};