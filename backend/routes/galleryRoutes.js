import express from 'express';
const router = express.Router();
import {
  getAllGalleryImages,
  addGalleryImage,
  deleteGalleryImage,
} from '../controllers/galleryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { uploadSingleImage } from '../middleware/uploadMiddleware.js';

router.route('/')
  .get(getAllGalleryImages)
  .post(protect, admin, uploadSingleImage, addGalleryImage);
  
router.route('/:id')
  .delete(protect, admin, deleteGalleryImage);

export default router;