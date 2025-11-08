import express from 'express';
const router = express.Router();
import {
  createBookingOrder,
  verifyPayment,
  getUserBookings,
  getEventBookings,
  getTicketById,
} from '../controllers/bookingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.post('/create-order', createBookingOrder);
router.post('/verify-payment', verifyPayment);
router.get('/my-bookings', protect, admin, getUserBookings);
router.get('/event/:eventId', protect, admin, getEventBookings);
router.get('/ticket/:bookingId', getTicketById);

export default router;