import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
// @access  Public

// @desc    Auth admin & get token (Login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log('--- LOGIN ATTEMPT ---');
  console.log('Data from Frontend:', { email, password });
  console.log('Data from .env:', {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  });
  console.log('---------------------');

  // 1. Check if email and password match the .env variables
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    // 2. Create a "dummy" admin user object to send back
    const adminUser = {
      _id: 'admin_user_001', // Static ID
      name: 'Admin',
      email: process.env.ADMIN_EMAIL,
      role: 'admin',
    };

    // 3. Send back the token and user data
    res.json({
      _id: adminUser._id,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role,
      token: generateToken(adminUser._id), // Token is still generated
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// We only need to export loginUser
export { loginUser };