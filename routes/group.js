const multer = require('multer');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const groupController = require('../controllers/groupController');

const fs = require('fs');

if (!fs.existsSync('uploads/groups')) {
    fs.mkdirSync('uploads/groups', { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/groups')
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const filename = Date.now() + '-' + Math.round(Math.random() * 1E9)+`.${ext}`
        req.profile = filename
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

router.post('/group/create',authMiddleware.auth,upload.single('group_pic'),groupController.create);
router.delete('/group/delete',authMiddleware.auth,groupController.delete);
router.get('/group',authMiddleware.auth,groupController.findAllGroup);


module.exports = router