import express from 'express';
const router = express.Router();
import {
  createGalleryEvent,
  getAllGalleryEvents,
  getGalleryEventBySlug,
  updateGalleryEvent,
  deleteGalleryEvent,
} from '../controllers/galleryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { uploadGalleryPortfolio } from '../middleware/uploadMiddleware.js'; // Naya uploader

router.route('/')
  .get(getAllGalleryEvents)
  .post(protect, admin, uploadGalleryPortfolio, createGalleryEvent);
  
router.route('/:slug')
  .get(getGalleryEventBySlug);

router.route('/:id')
  .put(protect, admin, uploadGalleryPortfolio, updateGalleryEvent)
  .delete(protect, admin, deleteGalleryEvent);

export default router;