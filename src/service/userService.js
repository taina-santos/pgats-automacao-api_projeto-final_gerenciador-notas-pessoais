const { users } = require('../model/userModel');
const { notes } = require('../model/noteModel');

function findUserByUsername(username) {
  return users.find(u => u.username === username);
}

function register(req, res) {
  const { username, password } = req.body;
  if (!username || !password){
    return res.status(400).json({ error: 'Usuário e senha obrigatórios.' });
  }

  if (users.find(u => u.username === username)){
    return res.status(409).json({ error: 'Usuário já existe.' });
  }
  
  users.push({ username, password });
  res.status(201).json({ message: 'Usuário registrado com sucesso.' });
}

function login({ username, password }) {
  const user = findUserByUsername(username);
  if (!user || user.password !== password) {
    throw new Error('Credenciais inválidas');
  }

  return user;
}

function getUsers() {
  const result = users.map(u => ({
    username: u.username,
    notesCount: notes.filter(n => n.username === u.username).length
  }));
  return result;
}

module.exports = { register, login, getUsers };
