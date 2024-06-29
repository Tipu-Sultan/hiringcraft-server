const express = require('express');
const router = express.Router();
const multer = require('multer');
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

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif','image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only image, video, and audio files are allowed."), false);
    }
  };
  
  const multerStorage = multer.memoryStorage();
  const upload = multer({
    storage: multerStorage,
    fileFilter: fileFilter,
  });
  

router.route('/profile').put(protect,upload.fields([{ name: 'profileImage', maxCount: 1 }]), updateUserProfile);
router.route('/profile/:userId').get(protect, getUserProfileById);
router.route('/profile/education').post(protect, updateUserEducationProfile).delete(protect,deleteEducationProfileData);
router.route('/profile/experiance').put(protect, updateUserExperianceProfile).delete(protect,deleteExperianceProfileData);
router.route('/profile/project').put(protect, updateUserProjectProfile).delete(protect,deleteProjectProfileData);





module.exports = router;