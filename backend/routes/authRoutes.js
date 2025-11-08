import express from 'express';
const router = express.Router();
import { loginUser } from '../controllers/authController.js';
// We don't need registerUser or getUserProfile

router.post('/login', loginUser);

export default router;