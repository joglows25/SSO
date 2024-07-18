// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/facebook', authController.facebookAuth);
router.get('/facebook/callback', authController.facebookCallback);
router.get('/profile', authController.profile);
router.get('/login', authController.login);

module.exports = router;