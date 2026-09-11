const Event = require("../models/Event");
const EventRegistration = require("../models/EventRegistration");

// Create Event
exports.createEvent = async (req, res) => {
  try {
    const {
  title,
  description,
  location,
  eventDate,
  capacity,
} = req.body;

    if (!title || !description || !location || !eventDate) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }
    if (capacity !== undefined && Number(capacity) < 1) {
  return res.status(400).json({
    message: "Capacity must be at least 1",
  });
}

    const event = await Event.create({
  title,
  description,
  location,
  eventDate,
  capacity: capacity ? Number(capacity) : 100,
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
    const {
      title,
      description,
      location,
      eventDate,
      capacity,
    } = req.body;

    if (
      capacity !== undefined &&
      Number(capacity) < 1
    ) {
      return res.status(400).json({
        message: "Capacity must be at least 1",
      });
    }
    if (capacity !== undefined) {
  const registeredCount =
    await EventRegistration.countDocuments({
      event: req.params.id,
    });

  if (Number(capacity) < registeredCount) {
    return res.status(400).json({
      message: `Capacity cannot be less than ${registeredCount} registered students`,
    });
  }
}

    const updates = {};

    if (title !== undefined) updates.title = title;
    if (description !== undefined)
      updates.description = description;
    if (location !== undefined)
      updates.location = location;
    if (eventDate !== undefined)
      updates.eventDate = eventDate;
    if (capacity !== undefined)
      updates.capacity = Number(capacity);

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
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
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    // Remove registrations belonging to this event
    await EventRegistration.deleteMany({
      event: event._id,
    });

    await event.deleteOne();

    return res.status(200).json({
      message: "Event deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
exports.getUpcomingEvents = async (req, res) => {
  try {
    const today = new Date();

    const events = await Event.find({
      eventDate: { $gte: today },
    })
      .populate('createdBy', 'name email role')
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

exports.getPastEvents = async (req, res) => {
  try {
    const today = new Date();

    const events = await Event.find({
      eventDate: { $lt: today },
    })
      .populate('createdBy', 'name email role')
      .sort({ eventDate: -1 });

    return res.status(200).json({
      events,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};