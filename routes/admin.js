const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminMiddleware = require('../middleware/adminMiddleware')

router.post('/admin/login',adminController.login);
router.get('/admin/post',adminMiddleware.auth,adminController.getNotValidatePost)
router.post('/admin/validate',adminMiddleware.auth,adminController.validatePost)
router.post('/admin/logout',adminMiddleware.auth,adminController.logout)

module.exports = router