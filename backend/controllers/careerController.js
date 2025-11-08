import asyncHandler from 'express-async-handler';
import Career from '../models/Career.js';
import Application from '../models/Application.js';
import uploadToCloudinary from '../utils/cloudinaryUploader.js';

// @desc    Get all careers
// @route   GET /api/careers
// @access  Public
const getAllCareers = asyncHandler(async (req, res) => {
  const careers = await Career.find({});
  res.json(careers);
});

// @desc    Create a career
// @route   POST /api/careers
// @access  Admin
const createCareer = asyncHandler(async (req, res) => {
  const { jobTitle, location, description, applyLink } = req.body;
  const career = await Career.create({
    jobTitle,
    location,
    description,
    applyLink,
  });
  res.status(201).json(career);
});

// @desc    Delete a career
// @route   DELETE /api/careers/:id
// @access  Admin
const deleteCareer = asyncHandler(async (req, res) => {
  const career = await Career.findById(req.params.id);
  if (career) {
    await career.deleteOne();
    res.json({ message: 'Career removed' });
  } else {
    res.status(404); throw new Error('Career not found');
  }
});

const applyForJob = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const { jobSlug } = req.params;

  if (!req.files || !req.files.resume) { // We re-use 'image' field for resume
    res.status(400);
    throw new Error('No resume file uploaded');
  }

  // Upload resume to Cloudinary (PDFs/DOCX accepted by default)
  let resumeUrl = '';
  try {
    const result = await uploadToCloudinary(req.files.resume[0].buffer, 'resumes');
    resumeUrl = result.secure_url;
  } catch (error) {
    res.status(500);
    throw new Error('Resume upload failed');
  }

  const job = await Career.findOne({ slug: jobSlug });
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  const application = await Application.create({
    jobId: job._id,
    name,
    email,
    resumeUrl,
  });

  res.status(201).json(application);
});

// @desc    Get all applications (for admin)
// @route   GET /api/careers/applications
// @access  Admin
const getAllApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({})
    .populate('jobId', 'jobTitle') // Get job title from Career model
    .sort({ appliedAt: -1 });
  res.json(applications);
});

export { getAllCareers, createCareer, deleteCareer, applyForJob, getAllApplications };