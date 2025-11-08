import express from 'express';
const router = express.Router();
import {
  getAllCareers,
  createCareer,
  deleteCareer,
  applyForJob,
  getAllApplications,
} from '../controllers/careerController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { uploadResumeFile } from '../middleware/uploadMiddleware.js';

router.route('/')
  .get(getAllCareers)
  .post(protect, admin, createCareer);

router.route('/apply/:jobId').post(uploadResumeFile, applyForJob);
  
router.route('/:id')
  .delete(protect, admin, deleteCareer);

router.route('/applications').get(protect, admin, getAllApplications);

router.route('/apply/:jobSlug').post(uploadResumeFile, applyForJob);

export default router;