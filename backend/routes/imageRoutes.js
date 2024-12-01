const express = require('express');
const imageController = require('../controllers/imageController');
const authenticateToken = require('../middlewares/authenticateToken');
const isAdmin = require('../middlewares/isAdmin');

const router = express.Router();

router.post('/upload-images', authenticateToken, isAdmin, imageController.uploadImages);
router.get('/', imageController.getPaginatedImages);
router.delete('/:id', authenticateToken, isAdmin, imageController.deleteImageById);

module.exports = router;
