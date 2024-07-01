const asyncHandler = require('express-async-handler');
const Job = require('../models/jobModel');
const User = require('../models/userModel');

const createJob = asyncHandler(async (req, res) => {
  const { companyName, jobTitle, location, experience, description, jobImage } = req.body;

  const job = new Job({
    companyName,
    jobTitle,
    location,
    experience,
    description,
    jobImage,
    postedBy: req.user._id,
  });

  const createdJob = await job.save();
  res.status(201).json(createdJob);
});

const updateJob = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { companyName, jobTitle, location, experience, description, jobImage } = req.body;

  const job = await Job.findById(id);

  if (job) {
    job.companyName = companyName;
    job.jobTitle = jobTitle;
    job.location = location;
    job.experience = experience;
    job.description = description;
    job.jobImage = jobImage;

    const updatedJob = await job.save();
    res.json(updatedJob);
  } else {
    res.status(404);
    throw new Error('Job not found');
  }
});

const getJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find().populate('postedBy', 'name email');
  res.json(jobs);
});

const filtersjobs = asyncHandler(async (req, res) => {
  const { company, location, jobProfileType } = req.query;

  let query = {};

  // Handle array of companies
  if (company) {
    if (Array.isArray(company)) {
      query.companyName = { $in: company.map(c => new RegExp(c, 'i')) };
    } else {
      query.companyName = new RegExp(company, 'i');
    }
  }

  if (location) {
    query.location = new RegExp(location, 'i');
  }

  // Handle array of jobProfileType
  if (jobProfileType) {
    if (Array.isArray(jobProfileType)) {
      query.jobTitle = { $in: jobProfileType.map(jpt => new RegExp(jpt, 'i')) };
    } else {
      query.jobTitle = new RegExp(jobProfileType, 'i');
    }
  }

  try {
    const jobs = await Job.find(query);
    if (jobs.length === 0) {
      return res.status(404).json({ message: 'Jobs not found' });
    }
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getJobspostedBy = asyncHandler(async (req, res) => {
  const { postedBy } = req.params;

  const jobs = await Job.find({ postedBy }).populate('postedBy', 'name email');

  if (jobs.length > 0) {
    res.json(jobs);
  } else {
    res.status(404).json({ message: 'No jobs found for the specified user' });
  }
});

const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate('postedBy', 'name email');

  if (job) {
    res.json(job);
  } else {
    res.status(404);
    throw new Error('Job not found');
  }
});

const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findByIdAndDelete(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  res.json({ message: 'Job removed' });
});

const cancelJobApplication = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const jobIdToDelete = req.params.userId;

  // Find the user and job based on their IDs
  const user = await User.findById(userId);
  const job = await Job.findById(jobIdToDelete);

  // Check if user and job exist
  if (!user || !job) {
    res.status(404);
    throw new Error('User or Job not found');
  }

  // Remove the job ID from user's appliedJobs array
  user.appliedJobs.pull(jobIdToDelete);

  // Remove the user ID from job's applicants array
  job.applicants.pull(userId);

  // Save both documents to persist the changes
  await user.save();
  await job.save();

  res.json({ jobId: jobIdToDelete, message: 'Job application cancelled successfully' });
});


const applyForJob = asyncHandler(async (req, res) => {
  const { jobId, fullName, email, phone, message } = req.body;

  const job = await Job.findById(jobId);
  const user = await User.findById(req.user._id);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  // Assuming req.user contains the logged-in user information
  const applicant = req.user._id;

  // Check if user has already applied
  if (job.applicants.includes(applicant)) {
    res.status(400);
    throw new Error('You have already applied for this job');
  }

  // Add applicant to job's applicants array
  job.applicants.push(applicant);
  user.appliedJobs.push(jobId);
  await job.save();
  await user.save();

  res.status(201).json({ jobId,applicant, message: 'Job application submitted successfully' });
});

const viewApplicants = asyncHandler(async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId).populate('applicants', 'name email address');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job.applicants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

const viewAppliedJobs = asyncHandler(async (req, res) => {

  try {
    const user = await User.findById(req.params.userId).populate('appliedJobs', 'companyName jobTitle location');
    if (!user) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(user.appliedJobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

module.exports = {
  createJob,
  getJobs,
  getJobspostedBy,
  getJobById,
  updateJob,
  deleteJob,
  applyForJob,
  viewApplicants,
  viewAppliedJobs,
  filtersjobs,
  cancelJobApplication
};