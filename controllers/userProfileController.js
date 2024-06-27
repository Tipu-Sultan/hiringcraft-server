// controllers/userController.js
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const dotenv = require('dotenv');
const sendEmail = require('../utils/sendMail');
const { generateOtp } = require('../utils/generateOtp');
const checkPassword = require('../utils/checkPassword');

dotenv.config();


const getUserProfileById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId).select('-password -verificationToken -isVerified -isOtp -otpExpires');

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      appliedJobs: user.appliedJobs,
      summary: user.summary,
      education: user.education,
      projects: user.projects,
      experience: user.experience,
      resumeOrCv: user.resumeOrCv,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      address: user.address
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name|| user.name;
    user.email = req.body.email|| user.email;
    user.address = req.body.address || user.address;
    
    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      address: updatedUser.address,
      profileImage: updatedUser.profileImage,
      token: generateToken(updatedUser._id),
      message: "User has been updated"
    });    
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const updateUserEducationProfile = asyncHandler(async (req, res) => {
  const {CourseOrBranchName, collegeOrUniversity, collegeOrUniversityAddress, passingYear, cgpaOrPercentage } = req.body.updatedEducation;
  // Validate the required fields
  if (!CourseOrBranchName || !collegeOrUniversity || !collegeOrUniversityAddress || !passingYear || !cgpaOrPercentage) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Find the user by ID and update the education field
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const newEducation = {
    CourseOrBranchName,
    collegeOrUniversity,
    collegeOrUniversityAddress,
    passingYear: passingYear,
    cgpaOrPercentage:cgpaOrPercentage
  };

  user.education.push(newEducation);

  // Save the updated user document
  await user.save();

  res.status(200).json({
    message: 'Education updated successfully',
    education: newEducation
  });
});
const deleteEducationProfileData = asyncHandler(async (req, res) => {
    const { eduId } = req.query;
    
    // Find the user and remove the education entry
    const user = await User.findOneAndUpdate(
      { 'education._id': eduId },
      { $pull: { education: { _id: eduId } } },
      { new: true } // Return the updated document
    );
  
    if (!user) {
      return res.status(404).json({
        message: 'Education entry not found'
      });
    }
  
    res.status(200).json({
      message: 'Education entry deleted successfully',
      eduId: eduId
    });
});

const updateUserExperianceProfile = asyncHandler(async (req, res) => {
  const {
    companyName,
    jobProfile,
    jobType,
    jobDescription,
  } = req.body.updatedExperience;
  // Validate the required fields
  if (!companyName || !jobProfile || !jobType || !jobDescription) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Find the user by ID and update the education field
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const newExperiance = {
    companyName,
    jobProfile,
    jobType,
    jobDescription,
  };

  user.experience.push(newExperiance);

  // Save the updated user document
  await user.save();

  res.status(200).json({
    message: 'Experience updated successfully',
    experience: newExperiance
  });
});
const deleteExperianceProfileData = asyncHandler(async (req, res) => {
    const { exId } = req.query;
    
    // Find the user and remove the education entry
    const user = await User.findOneAndUpdate(
      { 'experience._id': exId },
      { $pull: { experience: { _id: exId } } },
      { new: true } // Return the updated document
    );
  
    if (!user) {
      return res.status(404).json({
        message: 'Experience entry not found'
      });
    }
  
    res.status(200).json({
      message: 'Experience entry deleted successfully',
      exId: exId
    });
});

const updateUserProjectProfile = asyncHandler(async (req, res) => {
  const {
    projectTitle,
    projectDuration,
    projectDescription,
    projectCodeOrHostLink
  } = req.body.updatedProject;
  // Validate the required fields
  if (!projectTitle || !projectDuration || !projectDescription || !projectCodeOrHostLink) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Find the user by ID and update the education field
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const newProject = {
    projectTitle,
    projectDuration,
    projectDescription,
    projectCodeOrHostLink
  };

  user.projects.push(newProject);

  // Save the updated user document
  await user.save();

  res.status(200).json({
    message: 'Project updated successfully',
    project: newProject
  });
});
const deleteProjectProfileData = asyncHandler(async (req, res) => {
    const { proId } = req.query;
    
    // Find the user and remove the education entry
    const user = await User.findOneAndUpdate(
      { 'projects._id': proId },
      { $pull: { projects: { _id: proId } } },
      { new: true } // Return the updated document
    );
  
    if (!user) {
      return res.status(404).json({
        message: 'Project entry not found'
      });
    }
  
    res.status(200).json({
      message: 'Project entry deleted successfully',
      proId: proId
    });
});


  






module.exports = {
  updateUserProfile,
  getUserProfileById,
  updateUserEducationProfile,
  updateUserProjectProfile,
  updateUserExperianceProfile,
  deleteEducationProfileData,
  deleteExperianceProfileData,
  deleteProjectProfileData
};