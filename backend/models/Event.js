import mongoose from 'mongoose';

const eventSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    venue: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    seatingCapacity: { type: Number, required: true },
    ticketsAvailable: { type: Number, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    bannerImageUrl: { type: String, required: false }, 
    venueImageUrl: { type: String, required: false },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Event = mongoose.model('Event', eventSchema);
export default Event;