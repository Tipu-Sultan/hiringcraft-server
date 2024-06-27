const express = require('express');
const {
    getUserProfileById,
    updateUserEducationProfile,
    updateUserExperianceProfile,
    updateUserProjectProfile,
    updateUserProfile,
    deleteEducationProfileData,
    deleteExperianceProfileData,
    deleteProjectProfileData
} = require('../controllers/userProfileController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/profile').put(protect, updateUserProfile);
router.route('/profile/:userId').get(protect, getUserProfileById);
router.route('/profile/education').post(protect, updateUserEducationProfile).delete(protect,deleteEducationProfileData);
router.route('/profile/experiance').put(protect, updateUserExperianceProfile).delete(protect,deleteExperianceProfileData);
router.route('/profile/project').put(protect, updateUserProjectProfile).delete(protect,deleteProjectProfileData);





module.exports = router;