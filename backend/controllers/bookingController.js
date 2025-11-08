import asyncHandler from 'express-async-handler';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { nanoid } from 'nanoid';
import Booking from '../models/Booking.js';
import Event from '../models/Event.js';
import generateQRCode from '../utils/generateQRCode.js';
import sendEmail from '../utils/sendEmail.js';
import sendWhatsAppMessage from '../utils/sendWhatsApp.js';

// --- Initialize Razorpay ---
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// @desc    Create a Razorpay order
// @route   POST /api/bookings/create-order
// @access  Public
const createBookingOrder = asyncHandler(async (req, res) => {
  const {
    eventId,
    ticketCount,
    attendeeName,
    attendeeEmail,
    attendeePhone,
    attendeeDOB,
  } = req.body;

  const event = await Event.findById(eventId);
  if (!event) {
    res.status(404); throw new Error('Event not found');
  }
  if (event.ticketsAvailable < ticketCount) {
    res.status(400); throw new Error('Not enough tickets available');
  }

  const totalAmountInPaise = (event.price * ticketCount) * 100; // Razorpay needs paise

  // 1. Create a *pending* booking in our DB
  const pendingBooking = await Booking.create({
    eventId,
    attendeeName,
    attendeeEmail,
    attendeePhone,
    attendeeDOB,
    ticketCount,
    totalAmount: totalAmountInPaise / 100, // Store as Rupees
    paymentStatus: 'pending',
  });

  // 2. Create Razorpay order
  const options = {
    amount: totalAmountInPaise,
    currency: 'INR',
    receipt: pendingBooking._id.toString(), // Use our booking ID as the receipt
    notes: {
      booking_id: pendingBooking._id.toString(),
    },
  };

  try {
    const order = await razorpay.orders.create(options);
    // Send back the order details AND our booking ID
    res.json({ order, booking_id: pendingBooking._id });
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    res.status(500);
    throw new Error('Could not create payment order');
  }
});

// @desc    Verify Razorpay payment
// @route   POST /api/bookings/verify-payment
// @access  Public
const verifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    booking_id, // Our internal booking ID
  } = req.body;

  // 1. Find our pending booking
  const booking = await Booking.findById(booking_id).populate('eventId', 'title date venue time');
  if (!booking || booking.paymentStatus === 'completed') { // Check for completed too
    res.status(404); throw new Error('Booking not found or already processed');
  }

  // 2. Verify Razorpay Signature
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest('hex');

  // 3. Check if signature is valid
  if (expectedSignature !== razorpay_signature) {
    booking.paymentStatus = 'failed';
    await booking.save();
    res.status(400);
    throw new Error('Payment verification failed. Invalid signature.');
  }

  // --- PAYMENT IS VERIFIED! ---
  
  const event = await Event.findById(booking.eventId);

  if (event.ticketsAvailable < booking.ticketCount) {
    res.status(400); throw new Error('Tickets just got sold out. Payment will be refunded.');
    // TODO: Trigger Razorpay refund
  }

  // 4. Ticket ID Generate Karein
  const ticketId = `EBY-${nanoid(8).toUpperCase()}`;

  // 5. Naya QR Code Generate Karein (Sirf Ticket ID se)
  const qrCodeUrl = await generateQRCode(ticketId);
  
  // 6. Booking ko Update Karein
  booking.paymentStatus = 'completed';
  booking.qrCodeUrl = qrCodeUrl;
  booking.ticketId = ticketId; // Naya Ticket ID save karein
  booking.paymentRequestId = razorpay_payment_id; // Razorpay payment ID
  
  // 7. Event Tickets Update Karein
  event.ticketsAvailable = event.ticketsAvailable - booking.ticketCount;
  
  await booking.save();
  await event.save();

try {
  // --- NAYA, CLEAN ENGLISH HTML ---
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #333; color: white; padding: 20px;">
        <h1 style="margin: 0;">Booking Confirmed!</h1>
      </div>
      <div style="padding: 24px;">
        <p style="font-size: 16px;">Hi ${booking.attendeeName},</p>
        <p style="font-size: 16px; color: #555;">
          Your ticket for <strong>${booking.eventId.title}</strong> is confirmed.
        </p>

        <div style="border-top: 1px solid #eee; margin-top: 24px; padding-top: 24px;">
          <h2 style="margin: 0 0 16px 0;">Your Ticket Details:</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 12px 0; color: #555;">TICKET ID</td>
              <td style="padding: 12px 0; text-align: right; font-weight: bold;">${ticketId}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 12px 0; color: #555;">EVENT</td>
              <td style="padding: 12px 0; text-align: right; font-weight: bold;">${booking.eventId.title}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 12px 0; color: #555;">VENUE</td>
              <td style="padding: 12px 0; text-align: right; font-weight: bold;">${booking.eventId.venue}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 12px 0; color: #555;">DATE & TIME</td>
              <td style="padding: 12px 0; text-align: right; font-weight: bold;">
                ${new Date(booking.eventId.date).toLocaleDateString()} at ${booking.eventId.time}
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 12px 0; color: #555;">TICKETS</td>
              <td style="padding: 12px 0; text-align: right; font-weight: bold;">${booking.ticketCount}</td>
            </tr>
          </table>
        </div>

        <div style="text-align: center; margin-top: 24px;">
          <p style="color: #555;">Scan this QR code at the entrance:</p>
          <img src="cid:qrcode@evently.com" alt="Your QR Code" style="width: 200px; height: 200px;" />
        </div>
      </div>
    </div>
  `;

  // --- NAYA ATTACHMENT LOGIC ---
  await sendEmail({
    to: booking.attendeeEmail,
    subject: `Your Ticket for ${booking.eventId.title} (ID: ${ticketId})`,
    html: emailHtml,
    attachments: [
      {
        filename: 'qrcode.png',
        path: qrCodeUrl, // Yeh aapka base64 (data URI) string hai
        cid: 'qrcode@evently.com' // Content-ID (cid) upar waale <img> src se match hona chahiye
      }
    ]
  });
} catch (emailError) {
  console.error('Failed to send email:', emailError);
}

  // 9. WhatsApp Message Bhejein (Simulated)
  await sendWhatsAppMessage(booking);
  
  // 10. Frontend ko poora booking object waapis bhejein
  res.status(201).json({
    message: 'Booking successful!',
    booking: booking,
  });
});

// @desc    Get public ticket details by Booking ID
// @route   GET /api/bookings/ticket/:bookingId
// @access  Public
const getTicketById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.bookingId)
    .populate('eventId', 'title date venue time'); // Event ki details bhi le aayein

  if (booking && booking.paymentStatus === 'completed') {
    // Sirf zaroori data hi bhejein
    res.json({
      ticketId: booking.ticketId,
      attendeeName: booking.attendeeName,
      attendeeEmail: booking.attendeeEmail,
      ticketCount: booking.ticketCount,
      qrCodeUrl: booking.qrCodeUrl,
      event: booking.eventId, // Poora event object
    });
  } else {
    res.status(404);
    throw new Error('Ticket not found or payment not completed');
  }
});

// @desc    Get ALL bookings (for Admin)
// @route   GET /api/bookings/my-bookings
// @access  Private/Admin
const getUserBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({})
    .populate('eventId', 'title date')
    .sort({ createdAt: -1 });
  res.json(bookings);
});

// @desc    Get all bookings for a specific event (for Admin)
// @route   GET /api/bookings/event/:eventId
// @access  Private/Admin
const getEventBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ eventId: req.params.eventId })
    .sort({ createdAt: -1 });
  res.json(bookings);
});

export {
  createBookingOrder,
  verifyPayment,
  getUserBookings,
  getEventBookings,
  getTicketById,
};