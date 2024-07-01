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

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const userExists = await User.findOne({ email });

  // Check if user already exists
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Validate password criteria (Implement your own criteria check function)
  const passwordCriteria = checkPassword(password); // Assume this function is defined elsewhere
  if (!passwordCriteria.length || !passwordCriteria.lowercase || !passwordCriteria.uppercase || !passwordCriteria.number || !passwordCriteria.specialChar) {
    return res.status(400).json({ message: 'Password criteria not met' });
  }

  const verificationToken = crypto.randomBytes(32).toString('hex');
  const user = await User.create({ name, email, password, role, verificationToken });

  if (user) {
    const verificationUrl = `${process.env.API_HOST}/verify-email?token=${verificationToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Email Verification',
      text: `Please verify your email by clicking on the following link: ${verificationUrl}`,
    });

    return res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
    });
  } else {
    return res.status(400).json({ message: 'Invalid user data' });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    if (!user.isVerified) {
      res.status(401).json({
        message: 'Your account is not verified. Please verify your email to log in.',
      });
      throw new Error('Your account is not verified. Please verify your email to log in.');
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      address: user.address,
      appliedJobs: user.appliedJobs,
      summary: user.summary,
      isVerified:user.isVerified,
      education: user.education,
      projects: user.projects,
      experience: user.experience,
      resumeOrCv: user.resumeOrCv,
      token: generateToken(user._id)
    });    
  } else {
    res.status(401).json({
      message: 'Invalid email or password',
    });;
    throw new Error('Invalid email or password');
  }
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;
  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired token');
  }

  user.isVerified = true;
  await user.save();
  res.json({ message: 'Email verified successfully. You can now log in.' });
});

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = generateOtp();
    user.isOtp = otp;
    user.otpExpires = Date.now() + 3600000; 
    await user.save();

    await sendEmail({
      to: email,
      subject: 'OTP For Reset-Password',
      text: `This is your reset password OTP ${otp}`,
    });

    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updatePassword = asyncHandler(async (req, res) => {
  const { otp, newPassword } = req.body;
  const NewOtp = parseInt(otp);

  try {
    // Find the user by OTP
    const user = await User.findOne({ isOtp: NewOtp });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP is valid and not expired
    if (user.isOtp !== NewOtp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Validate password criteria
    const passwordCriteria = checkPassword(newPassword);
    if (!passwordCriteria.length || !passwordCriteria.lowercase || !passwordCriteria.uppercase || !passwordCriteria.number || !passwordCriteria.specialChar) {
      return res.status(400).json({
        message: 'Password criteria not met',
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password
    user.password = hashedPassword;

    // Clear the OTP and its expiration time
    user.isOtp = null;
    user.otpExpires = null;

    // Save the updated user
    await user.save();

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
});











module.exports = {
  registerUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  updatePassword,
};