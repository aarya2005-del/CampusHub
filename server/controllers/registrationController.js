const Event = require('../models/Event');
const Student = require('../models/Student');
const EventRegistration = require('../models/EventRegistration');

// ================= REGISTER FOR EVENT =================
exports.registerForEvent = async (req, res) => {
  try {
    const { eventId, studentId } = req.body;

    // Validate fields
    if (!eventId || !studentId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide eventId and studentId',
      });
    }

    // Check event exists
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check student exists
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // Check capacity
    const currentRegistrations =
      await EventRegistration.countDocuments({
        event: eventId,
      });

    if (currentRegistrations >= event.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Event is full',
      });
    }

    // Create registration
    const registration = await EventRegistration.create({
      event: eventId,
      student: studentId,
    });

    return res.status(201).json({
      success: true,
      message: 'Registered for event successfully',
      data: { registration },
    });

  } catch (error) {
    // Duplicate registration
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Student already registered for this event',
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= MY REGISTERED EVENTS =================
exports.getMyRegisteredEvents = async (req, res) => {
  try {
    const { studentId } = req.params;

    const registrations = await EventRegistration.find({
      student: studentId,
    })
      .populate(
        'event',
        'title description eventDate location capacity'
      )
      .sort({ registeredAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Registered events fetched successfully',
      data: { registrations },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= EVENT PARTICIPATION ANALYTICS =================
exports.getEventAnalytics = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Get event details
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Count registrations
    const totalParticipants =
      await EventRegistration.countDocuments({
        event: eventId,
      });

    // Calculate remaining seats
    const remainingSeats =
      event.capacity - totalParticipants;

    // Calculate capacity usage percentage
    const capacityUsagePercentage = Math.round(
      (totalParticipants / event.capacity) * 100
    );

    return res.status(200).json({
      success: true,
      message: 'Event analytics fetched successfully',
      data: {
        event: {
          id: event._id,
          title: event.title,
          eventDate: event.eventDate,
          location: event.location,
          capacity: event.capacity,
        },
        analytics: {
          totalParticipants,
          remainingSeats,
          capacityUsagePercentage,
          isFull: totalParticipants >= event.capacity,
        },
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};