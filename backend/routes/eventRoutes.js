import express from 'express';
const router = express.Router();
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { uploadEventImages } from '../middleware/uploadMiddleware.js';


router.route('/').get(getAllEvents).post(protect, admin, uploadEventImages, createEvent);
router
  .route('/:id')
  .get(getEventById)
  .put(protect, admin, updateEvent)
  .delete(protect, admin, deleteEvent);

export default router;