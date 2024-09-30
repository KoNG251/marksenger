const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware')
const postController = require('../controllers/postController')
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/posts')
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const filename = Date.now() + '-' + Math.round(Math.random() * 1E9)+`.${ext}`
        req.post_pic = filename
        cb(null, filename)
    }
})

const upload = multer({
    storage
})

const optionalUpload = (req, res, next) => {
    upload.single('post_pic')(req, res, function (err) {
        if (err) {
            return res.status(400).send(err.message);
        }
        next();
    });
};

router.post('/post/create',authMiddleware.auth,optionalUpload,postController.create);
router.put('/post/edit',authMiddleware.auth,optionalUpload,postController.edit);
router.delete('/post/delete',authMiddleware.auth,postController.delete);
router.get('/post',authMiddleware.auth,postController.allPost);

module.exports = router