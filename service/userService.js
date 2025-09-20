const { users, notes } = require('../model/db');

function register(req, res) {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Usuário e senha obrigatórios.' });
  if (users.find(u => u.username === username)) return res.status(409).json({ error: 'Usuário já existe.' });
  users.push({ username, password });
  res.status(201).json({ message: 'Usuário registrado com sucesso.' });
}

function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Usuário e senha obrigatórios.' });
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: 'Credenciais inválidas.' });
  // Simples token (apenas para fins didáticos)
  const token = Buffer.from(username).toString('base64');
  res.json({ token });
}

function getUsers(req, res) {
  const result = users.map(u => ({
    username: u.username,
    notesCount: notes.filter(n => n.username === u.username).length,
    notes: notes.filter(n => n.username === u.username)
  }));
  res.json(result);
}

module.exports = { register, login, getUsers };
