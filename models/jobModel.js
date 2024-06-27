const mongoose = require('mongoose');

const jobSchema = mongoose.Schema(
    {
        companyName: { type: String, required: true },
        jobTitle: { type: String, required: true },
        location: { type: String, required: true },
        experience: { type: String, required: true },
        description: { type: String, required: true },
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        jobImage: { type: String },
    },
    { timestamps: true }
);

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;