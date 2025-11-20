import express from 'express';
const router = express.Router();
import {
  getAllTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from '../controllers/teamController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { uploadSingleImage } from '../middleware/uploadMiddleware.js';

router.route('/')
  .get(getAllTeamMembers)
  .post(protect, admin, uploadSingleImage, createTeamMember);
  
router.route('/:id')
  .put(protect, admin, uploadSingleImage, updateTeamMember)
  .delete(protect, admin, deleteTeamMember);

export default router;