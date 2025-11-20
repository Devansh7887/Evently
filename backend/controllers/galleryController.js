import asyncHandler from 'express-async-handler';
import GalleryEvent from '../models/GalleryEvent.js';
import uploadToCloudinary from '../utils/cloudinaryUploader.js';

// @desc    Create new gallery event
// @route   POST /api/gallery
// @access  Admin
const createGalleryEvent = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!req.files || !req.files.thumbnailImage) {
    res.status(400);
    throw new Error('Thumbnail image is required');
  }

  let thumbnailImageUrl = '';
  let galleryImages = [];

  try {
    // 1. Thumbnail Upload
    const thumbResult = await uploadToCloudinary(req.files.thumbnailImage[0].buffer, 'gallery-thumbnails');
    thumbnailImageUrl = thumbResult.secure_url;

    // 2. Gallery Images Upload (Loop)
    if (req.files && req.files.galleryImages) {
      for (const file of req.files.galleryImages) {
        const result = await uploadToCloudinary(file.buffer, 'gallery-main');
        galleryImages.push({ imageUrl: result.secure_url });
      }
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500); throw new Error('Image upload failed');
  }

  // 3. Database mein save karein
  const galleryEvent = await GalleryEvent.create({
    title,
    description,
    thumbnailImageUrl,
    galleryImages,
  });

  res.status(201).json(galleryEvent);
});

// @desc    Get all gallery events
// @route   GET /api/gallery
// @access  Public
const getAllGalleryEvents = asyncHandler(async (req, res) => {
  const events = await GalleryEvent.find({}).sort({ createdAt: -1 });
  res.json(events);
});

// @desc    Get single gallery event by slug
// @route   GET /api/gallery/:slug
// @access  Public
const getGalleryEventBySlug = asyncHandler(async (req, res) => {
  const event = await GalleryEvent.findOne({ slug: req.params.slug });
  if (event) {
    res.json(event);
  } else {
    res.status(404); throw new Error('Gallery event not found');
  }
});

// @desc    Update a gallery event
// @route   PUT /api/gallery/:id
// @access  Admin
const updateGalleryEvent = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const event = await GalleryEvent.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Gallery event not found');
  }

  event.title = title || event.title;
  event.description = description || event.description;

  try {
    // Update thumbnail if provided
    if (req.files && req.files.thumbnailImage && req.files.thumbnailImage[0]) {
      const thumbResult = await uploadToCloudinary(req.files.thumbnailImage[0].buffer, 'gallery-thumbnails');
      event.thumbnailImageUrl = thumbResult.secure_url;
    }

    // Add new gallery images if provided (append to existing)
    if (req.files && req.files.galleryImages) {
      for (const file of req.files.galleryImages) {
        const result = await uploadToCloudinary(file.buffer, 'gallery-main');
        event.galleryImages.push({ imageUrl: result.secure_url });
      }
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500);
    throw new Error('Image upload failed');
  }

  const updatedEvent = await event.save();
  res.json(updatedEvent);
});

// @desc    Delete a gallery event
// @route   DELETE /api/gallery/:id
// @access  Admin
const deleteGalleryEvent = asyncHandler(async (req, res) => {
  const event = await GalleryEvent.findById(req.params.id);
  if (event) {
    await event.deleteOne();
    // TODO: Cloudinary se images delete karein
    res.json({ message: 'Gallery event removed' });
  } else {
    res.status(404); throw new Error('Gallery event not found');
  }
});

export {
  createGalleryEvent,
  getAllGalleryEvents,
  getGalleryEventBySlug,
  updateGalleryEvent,
  deleteGalleryEvent,
};