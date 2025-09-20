const express = require('express');
const router = express.Router();
const noteService = require('../service/noteService');

router.get('/', noteService.getNotesByUser);
router.post('/', noteService.createNote);
router.delete('/:id', noteService.deleteNote);

module.exports = router;
