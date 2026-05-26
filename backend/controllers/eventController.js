import Event from '../models/Event.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// @desc    Get all events (filtered by search, category, upcoming/past, and pagination)
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res, next) => {
  try {
    const { category, search, timeFilter, page = 1, limit = 6 } = req.query;

    const query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by upcoming vs past events
    if (timeFilter === 'upcoming') {
      query.date = { $gte: new Date() };
    } else if (timeFilter === 'past') {
      query.date = { $lt: new Date() };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Event.countDocuments(query);
    
    // Sort upcoming events by nearest first, past events by latest first
    const sortOption = timeFilter === 'upcoming' ? { date: 1 } : { date: -1 };

    const events = await Event.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: events.length,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit),
      },
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event by ID or Slug
// @route   GET /api/events/:identifier
// @access  Public
export const getEvent = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    let event;

    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      event = await Event.findById(identifier);
    } else {
      event = await Event.findOne({ slug: identifier });
    }

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

// @desc    Create event
// @route   POST /api/events
// @access  Private/Admin
export const createEvent = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = await uploadToCloudinary(req.file.buffer, 'events');
    }

    const event = await Event.create(req.body);
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin
export const updateEvent = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = await uploadToCloudinary(req.file.buffer, 'events');
    }

    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin
export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    await event.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// @desc    RSVP to an event
// @route   POST /api/events/:id/rsvp
// @access  Public
export const rsvpEvent = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email to RSVP' });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check if event is in the past
    if (new Date(event.date) < new Date()) {
      return res.status(400).json({ success: false, message: 'Cannot RSVP to a past event' });
    }

    // Check if already registered
    if (event.rsvpList.includes(email)) {
      return res.status(400).json({ success: false, message: 'You have already RSVPed for this event' });
    }

    event.rsvpList.push(email);
    await event.save();

    res.status(200).json({ success: true, message: 'RSVP confirmed successfully' });
  } catch (error) {
    next(error);
  }
};
