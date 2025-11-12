import mongoose from 'mongoose';
import slugify from 'slugify'; // <-- Yeh import zaroori hai

const imageSchema = mongoose.Schema({
  imageUrl: { type: String, required: true },
});

const eventSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true }, // <-- Yeh field zaroori hai
    description: { type: String, required: true },
    venue: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    seatingCapacity: { type: Number, required: true },
    ticketsAvailable: { type: Number, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    category: { type: String, required: true },
    bannerImageUrl: { type: String },
    venueImageUrl: { type: String },
    galleryImages: [imageSchema],
    // 'createdBy' humne pehle hi hata diya tha
  },
  { timestamps: true }
);

// --- YEH FUNCTION SABSE ZAROORI HAI ---
// Yeh function event 'save' hone se pehle title se slug banayega
eventSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});
// --- END ---

const Event = mongoose.model('Event', eventSchema);
export default Event;