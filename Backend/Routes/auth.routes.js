const router=require('express').Router();
const authController=require('../controllers/authController');
const upload = require('../utils/upload');

router.post('/register', upload.single('avatar'), authController.register);
router.post('/login', authController.login);
router.post('/send-otp', authController.sendOTP);
router.post('/reset-password', authController.resetPassword);
module.exports = router;