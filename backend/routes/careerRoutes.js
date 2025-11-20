import express from 'express';
const router = express.Router();
import {
  getAllCareers,
  createCareer,
  updateCareer,
  deleteCareer,
  applyForJob,
  getAllApplications,
} from '../controllers/careerController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { uploadResumeFile } from '../middleware/uploadMiddleware.js';

router.route('/')
  .get(getAllCareers)
  .post(protect, admin, createCareer);

router.route('/applications').get(protect, admin, getAllApplications);

router.route('/apply/:jobSlug').post(uploadResumeFile, applyForJob);
  
router.route('/:id')
  .put(protect, admin, updateCareer)
  .delete(protect, admin, deleteCareer);

export default router;