const express = require('express');
const router = express.Router();
const userService = require('../../src/service/userService');
const { generateToken } = require('../middleware/authMiddleware');

router.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password){
    return res.status(400).json({ error: 'Usuário e senha obrigatórios.' });
  }

  try {
    const user = userService.register({ username, password });
    res.status(201).json({ message: 'Usuário registrado com sucesso.', user: user });
  } catch (error) {
    return res.status(409).json({ error: error.message });
  }

});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password){
    return res.status(400).json({ error: 'Usuário e senha obrigatórios.' });
  }

  try {
    const user = userService.login({ username, password });
    const token = generateToken(user);
    res.json({ 
      message: 'Login realizado com sucesso',
      user: user,
      token: token
    });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
});

router.get('/', (req, res) => {
    res.json({ users: userService.getUsers()});
});

module.exports = router;
