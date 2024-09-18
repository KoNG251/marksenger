const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/comment',authMiddleware.auth,commentController.comment);
router.put('/comment/edit',authMiddleware.auth,commentController.edit);

module.exports = router