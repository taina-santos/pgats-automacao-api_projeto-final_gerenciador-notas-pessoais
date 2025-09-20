const express = require('express');
const router = express.Router();
const noteService = require('../../src/service/noteService');
const { authenticateJWT } = require('../middleware/authMiddleware');

router.get('/', authenticateJWT, (req, res) => {
  res.json({ notes: noteService.getNotesByUser(req.user.username) });
});

router.post('/', authenticateJWT, (req, res) => {
  const { title, content } = req.body;
  const username = req.user.username;
  if(!title || !content){
    return res.status(400).json({ error: 'Título e conteúdo obrigatórios.' });
  }

  const note = noteService.createNote({ username, title, content });
  res.status(201).json({ message: 'Nota criada com sucesso.', note });
});

router.delete('/:id', authenticateJWT, (req, res) => {
  const username = req.user.username;
  const paramId = parseInt(req.params.id);
  try {
    noteService.deleteNote({ paramId, username });
    res.status(200).json({ message: 'Nota excluída com sucesso.' });
  } catch (error) {
    res.status(404).json({error: error.message});
  }
});

module.exports = router;
