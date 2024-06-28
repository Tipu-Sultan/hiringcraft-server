const express = require('express');
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  applyForJob,
  viewApplicants,
  getJobspostedBy,
  viewAppliedJobs,
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(getJobs).post(protect, createJob);
router.route('/postedBy/:postedBy').get(protect,getJobspostedBy)
router.route('/apply').post(protect,applyForJob);
router.route('/:id').get(getJobById).put(protect, updateJob).delete(protect, deleteJob);
router.get('/:jobId/applicants', protect,viewApplicants );
router.get('/:userId/applied', protect,viewAppliedJobs );

module.exports = router;