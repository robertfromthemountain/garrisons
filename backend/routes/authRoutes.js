const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/verify-email', authController.verifyEmail);
router.post('/refresh-token', authController.refreshToken);
router.get('/verify-token', authController.verifyToken);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
