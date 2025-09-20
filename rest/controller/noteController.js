const express = require('express');
const router = express.Router();
const noteService = require('../../src/service/noteService');
const { authenticateJWT } = require('../middleware/authMiddleware');

router.get('/', authenticateJWT, noteService.getNotesByUser);
router.post('/', authenticateJWT, noteService.createNote);
router.delete('/:id', authenticateJWT, noteService.deleteNote);

module.exports = router;
