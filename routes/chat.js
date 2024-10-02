const authMiddleware = require('../middleware/authMiddleware');
const groupController = require('../controllers/groupController');
const express = require('express');
const router = express.Router();

router.post('/chat/create',authMiddleware.auth,groupController.create);
router.post('/chat/join',authMiddleware.auth,groupController.join);
router.get('/chat',authMiddleware.auth,groupController.selectGroup);
router.post('/chat/member',authMiddleware.auth,groupController.getMember);
router.post('/chat/send',authMiddleware.auth,groupController.sendMessage);
router.get('/chat/message/:id',authMiddleware.auth,groupController.getMessage);

module.exports = router