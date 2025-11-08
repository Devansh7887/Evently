import express from 'express';
const router = express.Router();
import {
  getAllTeamMembers,
  createTeamMember,
  deleteTeamMember,
} from '../controllers/teamController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { uploadSingleImage } from '../middleware/uploadMiddleware.js';

router.route('/')
  .get(getAllTeamMembers)
  .post(protect, admin, uploadSingleImage, createTeamMember);
  
router.route('/:id')
  .delete(protect, admin, deleteTeamMember);

export default router;