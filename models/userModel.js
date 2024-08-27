const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['normal', 'employer', 'super-admin'], default: 'normal' },
    profileImage: { type: String, default: '' },
    address: { type: String, default: '' },
    appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    verificationToken: { type: String, unique: true, sparse: true },
    isVerified: { type: Boolean, default: false },
    isOtp: { type: Number, default: null },
    otpExpires: { type: Date, default: null },
    summary: { type: String, default: '' },
    profileVisibility: [{
      email: { type: String, required: true,default: ''},
      mobile: { type: String, required: true,default: '' },
      resume: { type: String, required: true,default: '' },
      passingYear: { type: String, required: true,default: '' },
      cgpaOrPercentage: { type: String, required: true,default: '' }
    }],
    education: [{
      CourseOrBranchName: { type: String, required: true },
      collegeOrUniversity: { type: String, required: true },
      collegeOrUniversityAddress: { type: String, required: true },
      passingYear: { type: String, required: true },
      cgpaOrPercentage: { type: String, required: true }
    }],
    projects: [{
      projectTitle: { type: String, required: true },
      projectDuration: { type: String, required: true },
      projectDescription: { type: String, required: true },
      projectCodeOrHostLink: { type: String, required: true }
    }],
    experience: [{
      companyName: { type: String, required: true },
      jobProfile: { type: String, required: true },
      jobType: { type: String, required: true },
      jobDescription: { type: String, required: true }
    }],
    resumeOrCv: { type: String, default: '' }
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Ensure the password is hashed before saving the user document
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = bcrypt.hash(this.password, salt); 
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
