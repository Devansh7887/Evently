import mongoose from 'mongoose';
import slugify from 'slugify';

// Chhota schema (sirf URL store karne ke liye)
const imageSchema = mongoose.Schema({
  imageUrl: { type: String, required: true },
});

const galleryEventSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    
    // Admin ek thumbnail upload karega
    thumbnailImageUrl: { type: String, required: true },
    
    // Admin baaki ki images yahan upload karega
    galleryImages: [imageSchema],
  },
  { timestamps: true }
);

// Title se slug banayein
galleryEventSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

const GalleryEvent = mongoose.model('GalleryEvent', galleryEventSchema);
export default GalleryEvent;