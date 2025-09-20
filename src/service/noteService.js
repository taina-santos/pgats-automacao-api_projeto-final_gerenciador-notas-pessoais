const { notes } = require('../model/noteModel');

function getNotesByUser(username) {
  return notes.filter(n => n.username === username);
}

// Esse método vai ajudar a garantir que mesmo após excluir um item no meio do array de notes,
// o id seguirá sendo incrementado, não havendo duplicação de id
function getMaxIdNumber(){
  return notes.length > 0 ? Math.max(...notes.map(note => note.id)) : 0;
}

function createNote({ username, title, content }) {
  const id = getMaxIdNumber() + 1;
  const note = { id, username, title, content };
  notes.push(note);
  return note;
}

function deleteNote({ paramId, username }) {
  const idx = notes.findIndex(n => n.id === paramId && n.username === username);
  if(idx === -1){
    throw new Error('Nota não encontrada ou não pertence ao usuário.');
  }
  totalNotes = notes.length;
  notes.splice(idx, 1);
}

module.exports = { getNotesByUser, createNote, deleteNote };
