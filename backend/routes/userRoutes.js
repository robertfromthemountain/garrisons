const express = require('express');
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/authenticateToken');
const isAdmin = require('../middlewares/isAdmin');

const router = express.Router();

router.get('/', authenticateToken, isAdmin, userController.getAllUsers);
router.put('/:id', authenticateToken, isAdmin, userController.updateUser);
router.delete('/:id', authenticateToken, isAdmin, userController.deleteUser);
router.get('/loggedInUser', authenticateToken, isAdmin, userController.loggedInUser);

module.exports = router;