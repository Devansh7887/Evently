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

// @desc    Update a team member
// @route   PUT /api/team/:id
// @access  Admin
const updateTeamMember = asyncHandler(async (req, res) => {
  const { name, role, bio, linkedinId } = req.body;
  const member = await TeamMember.findById(req.params.id);

  if (!member) {
    res.status(404);
    throw new Error('Team member not found');
  }

  member.name = name || member.name;
  member.role = role || member.role;
  member.bio = bio || member.bio;
  member.linkedinId = linkedinId || member.linkedinId;

  // Update image if new one is provided
  if (req.files && req.files.image && req.files.image[0]) {
    try {
      const result = await uploadToCloudinary(req.files.image[0].buffer, 'team');
      member.imageUrl = result.secure_url;
    } catch (error) {
      res.status(500);
      throw new Error('Image upload failed');
    }
  }

  const updatedMember = await member.save();
  res.json(updatedMember);
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

export { getAllTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember };