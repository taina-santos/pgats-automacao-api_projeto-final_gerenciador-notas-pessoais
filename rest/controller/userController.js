const express = require('express');
const router = express.Router();
const userService = require('../../src/service/userService');

router.post('/register', userService.register);
router.post('/login', userService.login);
router.get('/', userService.getUsers);

module.exports = router;
