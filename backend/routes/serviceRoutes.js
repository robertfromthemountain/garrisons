const express = require('express');
const serviceController = require('../controllers/serviceController');
const authenticateToken = require('../middlewares/authenticateToken');
const isAdmin = require('../middlewares/isAdmin');

const router = express.Router();

router.get('/', serviceController.getAllServices);
router.post('/', authenticateToken, isAdmin, serviceController.createService);
router.put('/:id', authenticateToken, isAdmin, serviceController.updateService);
router.delete('/:id', authenticateToken, isAdmin, serviceController.deleteService);

module.exports = router;
