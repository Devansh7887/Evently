import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  ticketId: { type: String, unique: true, sparse: true },
  attendeeName: { type: String, required: true },
  attendeeEmail: { type: String, required: true },
  attendeePhone: { type: String },
  attendeeDOB: { type: Date },
  qrCodeUrl: { type: String },
});

const bookingOrderSchema = new mongoose.Schema( // <-- NAAM BADLA
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Event',
    },
    tickets: [ticketSchema], 
    ticketCount: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    paymentRequestId: { type: String }, 
  },
  { timestamps: true }
);

// Model ka naam 'Booking' se 'BookingOrder' karein
const BookingOrder = mongoose.model('BookingOrder', bookingOrderSchema); 

export default BookingOrder; // Naya model export karein