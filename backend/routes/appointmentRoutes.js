const express = require('express');
const appointmentController = require('../controllers/appointmentController');
const authenticateToken = require('../middlewares/authenticateToken');
const isAdmin = require('../middlewares/isAdmin');

const router = express.Router();

// Get all confirmed events
router.get('/getEvents', appointmentController.getEvents);
router.post('/requestAppointment', authenticateToken, appointmentController.requestAppointment);
router.get('/getPendingEvents', appointmentController.getPendingEvents);
router.get('/confirmEvent/:id', appointmentController.confirmEvent);
router.get('/deletePendingEvent/:id', appointmentController.deletePendingEvent);
router.post('/updateConfirmedEvents', authenticateToken, isAdmin, appointmentController.updateConfirmedEvents);
router.delete('/deleteEvent/:id', authenticateToken, isAdmin, appointmentController.deleteEvent);

module.exports = router;
