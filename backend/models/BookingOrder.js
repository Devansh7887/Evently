import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  ticketId: { type: String, unique: true, sparse: true },
  attendeeName: { type: String, required: true },
  attendeeEmail: { type: String, required: true },
  attendeePhone: { type: String },
  attendeeDOB: { type: Date },
  qrCodeUrl: { type: String },
});

const bookingOrderSchema = new mongoose.Schema(
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

// We're using a new name, so Mongoose won't use the cached old one
const BookingOrder = mongoose.model('BookingOrder', bookingOrderSchema); 

export default BookingOrder;