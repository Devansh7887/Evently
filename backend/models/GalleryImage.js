import mongoose from 'mongoose';

const galleryImageSchema = mongoose.Schema({
  title: { type: String, required: true },
  eventDate: { type: Date, required: false },
  imageUrl: { type: String, required: true },
});

const GalleryImage = mongoose.model('GalleryImage', galleryImageSchema);
export default GalleryImage;