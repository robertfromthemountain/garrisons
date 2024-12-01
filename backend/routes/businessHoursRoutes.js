const express = require('express');
const businessHoursController = require('../controllers/businessHoursController');
const authenticateToken = require('../middlewares/authenticateToken');
const isAdmin = require('../middlewares/isAdmin');

const router = express.Router();

// Get all business hours
router.get('/', businessHoursController.getBusinessHours);

// Update business hours for a specific day
router.put('/:id', authenticateToken, isAdmin, businessHoursController.updateBusinessHours);

module.exports = router;
