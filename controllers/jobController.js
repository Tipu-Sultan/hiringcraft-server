const asyncHandler = require('express-async-handler');
const Job = require('../models/jobModel');

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

const applyForJob = asyncHandler(async (req, res) => {
  const { jobId, fullName, email, phone, message } = req.body;

  const job = await Job.findById(jobId);

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
  await job.save();

  res.status(201).json({ message: 'Job application submitted successfully' });
});

const viewApplicants = asyncHandler(async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId).populate('applicants', 'name email location');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job.applicants);
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
  viewApplicants
};