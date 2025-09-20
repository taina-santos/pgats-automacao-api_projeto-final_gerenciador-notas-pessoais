const { notes } = require('../model/db');

function getNotesByUser(req, res) {
  const username = req.user.username;
  const userNotes = notes.filter(n => n.username === username);
  res.json(userNotes);
}

function createNote(req, res) {
  const username = req.user.username;
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Título e conteúdo obrigatórios.' });
  const id = notes.length + 1;
  notes.push({ id, username, title, content });
  res.status(201).json({ message: 'Nota criada com sucesso.', id });
}

function deleteNote(req, res) {
  const username = req.user.username;
  const id = parseInt(req.params.id);
  const idx = notes.findIndex(n => n.id === id && n.username === username);
  if (idx === -1) return res.status(404).json({ error: 'Nota não encontrada ou não pertence ao usuário.' });
  notes.splice(idx, 1);
  res.json({ message: 'Nota excluída com sucesso.' });
}

module.exports = { getNotesByUser, createNote, deleteNote };
