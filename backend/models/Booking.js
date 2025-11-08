import mongoose from 'mongoose';

const bookingSchema = mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Event',
    },
    // --- NEW GUEST FIELDS ---
    attendeeName: { type: String, required: true },
    attendeeEmail: { type: String, required: true },
    attendeePhone: { type: String, required: false },
    attendeeDOB: { type: Date, required: false },
    ticketCount: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    paymentRequestId: { type: String },
    ticketId: { type: String, unique: true, sparse: true },
    qrCodeUrl: { type: String }, // Will store the Data URL of the QR code
    attendeeName: { type: String, required: true },
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;