const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/avatar')
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const filename = `${req.user}.${ext}`
        req.avatar = filename
        cb(null, filename)
    }
})

const fileFilter = (req, file, cb) => {
    const validMimeTypes = ['image/png', 'image/jpeg'];
    if (validMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        req.error = "file only required .png .jpg .jpeg";
        cb(null,false);
    }
};

const upload = multer({
    storage : storage,
    fileFilter : fileFilter
});

router.post('/auth/login',authController.login);
router.post('/auth/register',authController.register);
router.put('/auth/update',authMiddleware.auth,authController.editprofile);
router.put('/auth/changeavatar',authMiddleware.auth,upload.single('avatar'),authController.changeavatar);
router.delete('/auth/user-delete',authMiddleware.auth,authController.deleteProfile);
router.put('/auth/change-password',authMiddleware.auth,authController.changePassword);
router.get('/auth/user/profile',authMiddleware.auth,authController.profile);
router.post('/auth/logout',authMiddleware.auth,authController.logout); 

module.exports = router