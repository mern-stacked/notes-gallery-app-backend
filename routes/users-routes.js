const express = require('express');
const userControllers = require('../controllers/users-controller');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.get('/', requireAuth, userControllers.getUsers);

// Signup route
router.post('/signup', userControllers.signup);

// Login route
router.post('/login', userControllers.login);


module.exports = router; 