import express from 'express';
const router = express.Router();
import {
  createEvent,
  getAllEvents,
  getEventBySlug, // Hum slug se GET karenge
  updateEvent,    // Hum ID se update karenge
  deleteEvent,    // Hum ID se delete karenge
} from '../controllers/eventController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { uploadEventImages } from '../middleware/uploadMiddleware.js';


// '/' (GET all events, POST new event)
router.route('/').get(getAllEvents).post(protect, admin, uploadEventImages, createEvent);

// '/:slug' (GET single event by slug)
router.route('/:slug').get(getEventBySlug);

// '/:id' (UPDATE and DELETE by ID)
router
  .route('/:id')
  .put(protect, admin, updateEvent)
  .delete(protect, admin, deleteEvent);

export default router;