const { users } = require('../model/userModel');
const { notes } = require('../model/noteModel');

function findUserByUsername(username) {
  return users.find(u => u.username === username);
}

function register({ username, password }) {
  if(findUserByUsername(username)){
    throw new Error('Usuário já existe');
  }

  const notesCount = 0;
  const user = { username, password, notesCount }
  users.push(user);

  return user;
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
