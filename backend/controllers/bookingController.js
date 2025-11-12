import asyncHandler from 'express-async-handler';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { nanoid } from 'nanoid';
// --- THIS IS THE FIX ---
import BookingOrder from '../models/BookingOrder.js'; // <-- Importing the NEW model
// --------------------
import Event from '../models/Event.js';
import generateQRCode from '../utils/generateQRCode.js';
import sendEmail from '../utils/sendEmail.js';
import sendWhatsAppMessage from '../utils/sendWhatsApp.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

const createBookingOrder = asyncHandler(async (req, res) => {
  const { eventId, ticketCount, attendees } = req.body;

  const event = await Event.findById(eventId);
  if (!event) { res.status(404); throw new Error('Event not found'); }
  if (event.ticketsAvailable < ticketCount) { res.status(400); throw new Error('Not enough tickets available'); }

  const totalAmountInPaise = (event.price * ticketCount) * 100;

  // Using the new model: BookingOrder
  const pendingBooking = await BookingOrder.create({
    eventId,
    tickets: attendees,
    ticketCount: Number(ticketCount),
    totalAmount: totalAmountInPaise / 100,
    paymentStatus: 'pending',
  });

  const options = {
    amount: totalAmountInPaise,
    currency: 'INR',
    receipt: pendingBooking._id.toString(),
    notes: { booking_id: pendingBooking._id.toString() },
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json({ order, booking_id: pendingBooking._id });
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    res.status(500);
    throw new Error('Could not create payment order');
  }
});

const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, booking_id } = req.body;

  // Using the new model: BookingOrder
  const booking = await BookingOrder.findById(booking_id).populate('eventId', 'title date venue time');
  if (!booking || booking.paymentStatus === 'completed') {
    res.status(404); throw new Error('Booking not found or already processed');
  }

  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    booking.paymentStatus = 'failed';
    await booking.save();
    res.status(400); throw new Error('Payment verification failed. Invalid signature.');
  }

  const event = await Event.findById(booking.eventId);
  let generatedTickets = [];
  let emailBodyTickets = '';

  for (const attendee of booking.tickets) {
    const ticketId = nanoid(10).toUpperCase();
    const qrCodeUrl = await generateQRCode(ticketId);
    generatedTickets.push({ ...attendee.toObject(), ticketId: ticketId, qrCodeUrl: qrCodeUrl });

    emailBodyTickets += `<div style="border: 1px dashed #ccc; padding: 10px; margin-bottom: 10px;"><p><strong>Ticket ID:</strong> ${ticketId}</p><p><strong>Name:</strong> ${attendee.attendeeName}</p><p><strong>Email:</strong> ${attendee.attendeeEmail}</p></div>`;
  }
  
  booking.paymentStatus = 'completed';
  booking.paymentRequestId = razorpay_payment_id;
  booking.tickets = generatedTickets;
  event.ticketsAvailable = event.ticketsAvailable - booking.ticketCount;
  
  await booking.save();
  await event.save();

  try {
    const emailHtml = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;"><h1 style="color: #333;">Booking Confirmed!</h1><p>Hi ${booking.tickets[0].attendeeName}, your ${booking.tickets.length} tickets are confirmed.</p><h2 style="color: #333;">${event.title}</h2><p style="color: #555;">${new Date(event.date).toLocaleDateString()} at ${event.time}</p><hr>${emailBodyTickets}<p>You can view and download all your tickets from this secure link:</p><a href="${process.env.FRONTEND_URL}/ticket/${booking._id}" style="background-color: #007bff; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">View My Tickets</a></div>`;
    await sendEmail({ to: booking.tickets[0].attendeeEmail, subject: `Your Tickets for ${event.title}`, html: emailHtml });
  } catch (emailError) { console.error('Failed to send email:', emailError); }
  
  await sendWhatsAppMessage(booking);
  
  res.status(201).json({ message: 'Booking successful!', booking: booking });
});

const getTicketById = asyncHandler(async (req, res) => {
  // Using the new model: BookingOrder
  const booking = await BookingOrder.findById(req.params.bookingId).populate('eventId', 'title date venue time');
  if (booking && booking.paymentStatus === 'completed') {
    res.json({ attendeeEmail: booking.tickets[0].attendeeEmail, tickets: booking.tickets, event: booking.eventId });
  } else {
    res.status(404); throw new Error('Ticket not found or payment not completed');
  }
});

const getUserBookings = asyncHandler(async (req, res) => {
  // Using the new model: BookingOrder
  const bookings = await BookingOrder.find({}).populate('eventId', 'title date').sort({ createdAt: -1 });
  res.json(bookings);
});

const getEventBookings = asyncHandler(async (req, res) => {
  // Using the new model: BookingOrder
  const bookings = await BookingOrder.find({ eventId: req.params.eventId }).sort({ createdAt: -1 });
  res.json(bookings);
});

export { createBookingOrder, verifyPayment, getTicketById, getUserBookings, getEventBookings };