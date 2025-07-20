const router = require('express').Router();
const userCtrl = require('../controllers/userController');
const auth = require('../middlewares/authMiddleware');

router.get('/me', auth, userCtrl.getProfile);
router.put('/update', auth, userCtrl.updateProfile);
// routes/user.routes.js
router.get("/progress", auth, userCtrl.getProgress);
router.post("/progress/xp", auth, userCtrl.updateXP);


module.exports = router;
