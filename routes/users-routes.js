const express = require('express');
const userControllers = require('../controllers/users-controller');
const router = express.Router();

router.get('/', userControllers.getUsers);

// Signup route
router.post('/signup', userControllers.signup);

// Login route
router.post('/login', userControllers.login);


module.exports = router; 