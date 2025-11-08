import asyncHandler from 'express-async-handler';
import GalleryImage from '../models/GalleryImage.js';
import uploadToCloudinary from '../utils/cloudinaryUploader.js';

// @desc    Get all gallery images
// @route   GET /api/gallery
// @access  Public
const getAllGalleryImages = asyncHandler(async (req, res) => {
  const images = await GalleryImage.find({}).sort({ eventDate: -1 });
  res.json(images);
});

// @desc    Add a gallery image
// @route   POST /api/gallery
// @access  Admin
const addGalleryImage = asyncHandler(async (req, res) => {
  const { title, eventDate } = req.body;
  if (!req.files || !req.files.image) {
    res.status(400); throw new Error('No image file uploaded');
  }
  
  const result = await uploadToCloudinary(req.files.image[0].buffer, 'gallery');
  
  const image = await GalleryImage.create({
    title,
    eventDate,
    imageUrl: result.secure_url,
  });
  res.status(201).json(image);
});

// @desc    Delete a gallery image
// @route   DELETE /api/gallery/:id
// @access  Admin
const deleteGalleryImage = asyncHandler(async (req, res) => {
  const image = await GalleryImage.findById(req.params.id);
  if (image) {
    await image.deleteOne();
    res.json({ message: 'Gallery image removed' });
  } else {
    res.status(404); throw new Error('Image not found');
  }
});

export { getAllGalleryImages, addGalleryImage, deleteGalleryImage };