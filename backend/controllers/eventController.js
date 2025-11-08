import asyncHandler from 'express-async-handler';
import Event from '../models/Event.js';
import cloudinary from '../config/cloudinary.js';
import uploadToCloudinary from '../utils/cloudinaryUploader.js';

// @desc    Create a new event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    venue,
    date,
    time,
    seatingCapacity,
    price,
    category,
  } = req.body;

  let bannerImageUrl = '';
  let venueImageUrl = '';

  try {
    // 1. Banner Image Upload
    if (req.files && req.files.bannerImage && req.files.bannerImage[0]) {
      // FIX: Added 'events' folder argument
      const bannerResult = await uploadToCloudinary(
        req.files.bannerImage[0].buffer,
        'events'
      );
      bannerImageUrl = bannerResult.secure_url;
    }

    // 2. Venue Image Upload
    if (req.files && req.files.venueImage && req.files.venueImage[0]) {
      // FIX: Added 'events' folder argument
      const venueResult = await uploadToCloudinary(
        req.files.venueImage[0].buffer,
        'events'
      );
      venueImageUrl = venueResult.secure_url;
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500);
    throw new Error('Image upload failed');
  }

  const event = new Event({
    title,
    description,
    venue,
    date,
    time,
    seatingCapacity,
    ticketsAvailable: seatingCapacity, // Initially, all tickets are available
    price,
    category,
    bannerImageUrl: bannerImageUrl, // Naya field
    venueImageUrl: venueImageUrl,
    createdBy: req.user._id,
  });

  const createdEvent = await event.save();
  res.status(201).json(createdEvent);
});

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getAllEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({}).sort({ date: 1 }); // Sort by date
  res.json(events);
});

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (event) {
    res.json(event);
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
});

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    venue,
    date,
    time,
    seatingCapacity,
    ticketsAvailable,
    price,
    category,
  } = req.body;

  const event = await Event.findById(req.params.id);

  if (event) {
    event.title = title || event.title;
    event.description = description || event.description;
    event.venue = venue || event.venue;
    event.date = date || event.date;
    event.time = time || event.time;
    event.seatingCapacity = seatingCapacity || event.seatingCapacity;
    event.ticketsAvailable = ticketsAvailable ?? event.ticketsAvailable; // Allow setting to 0
    event.price = price || event.price;
    event.category = category || event.category;

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
});

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (event) {
    await event.deleteOne(); // Use deleteOne()
    res.json({ message: 'Event removed' });
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
});

export {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};