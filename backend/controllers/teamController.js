import asyncHandler from 'express-async-handler';
import TeamMember from '../models/TeamMember.js';
import uploadToCloudinary from '../utils/cloudinaryUploader.js';

// @desc    Get all team members
// @route   GET /api/team
// @access  Public
const getAllTeamMembers = asyncHandler(async (req, res) => {
  const members = await TeamMember.find({});
  res.json(members);
});

// @desc    Create a team member
// @route   POST /api/team
// @access  Admin
const createTeamMember = asyncHandler(async (req, res) => {
  const { name, role, bio, linkedinId } = req.body;
  
  if (!req.files || !req.files.image) {
    res.status(400);
    throw new Error('No image file uploaded');
  }

  let imageUrl = '';
  try {
    const result = await uploadToCloudinary(req.files.image[0].buffer, 'team');
    imageUrl = result.secure_url;
  } catch (error) {
    res.status(500);
    throw new Error('Image upload failed');
  }

  const member = await TeamMember.create({
    name,
    role,
    bio,
    imageUrl,
    linkedinId,
  });
  res.status(201).json(member);
});

// @desc    Delete a team member
// @route   DELETE /api/team/:id
// @access  Admin
const deleteTeamMember = asyncHandler(async (req, res) => {
  const member = await TeamMember.findById(req.params.id);
  if (member) {
    await member.deleteOne();
    // TODO: Add logic to delete image from Cloudinary as well
    res.json({ message: 'Team member removed' });
  } else {
    res.status(404);
    throw new Error('Team member not found');
  }
});

export { getAllTeamMembers, createTeamMember, deleteTeamMember };