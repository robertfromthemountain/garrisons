const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const isAdmin = require('../middlewares/isAdmin');
const calendarController = require('../controllers/calendarController');

// Naptár megnyitása (Csak admin)
router.post('/open', authenticateToken, isAdmin, calendarController.openCalendar);

// Naptár lezárása (Csak admin)
router.post('/close', authenticateToken, isAdmin, calendarController.closeCalendar);

// Naptár állapotának lekérdezése (Minden hitelesített felhasználó számára)
router.get('/status/:year/:month', authenticateToken, calendarController.getCalendarStatus);

module.exports = router;
