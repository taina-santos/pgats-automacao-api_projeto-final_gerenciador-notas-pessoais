const userService = require('../src/service/userService');
const noteService = require('../src/service/noteService');
const { generateToken } = require('./auth');
const { getUserFromToken } = require('./auth');

module.exports = {
  Query: {
    users: () => userService.getUsers(),
    notes: (_, __, {req}) => {
      // Autenticação
      const authHeader = req.headers.authorization || '';
      const token = authHeader.replace('Bearer ', '');
      const user = getUserFromToken(token);
      if (!user) throw new Error('Token inválido ou ausente');
      // Retrieve notes
      const username = user.username;
      return noteService.getNotesByUser(username) 
    }
  },
  Mutation: {
    register: (_, { username, password }) => {
      return userService.register({ username, password });
    },
    login: (_, { username, password }) => {
      const user = userService.login({ username, password });
      const token = generateToken(user);
      return {
        message: 'Login realizado com sucesso',
        user,
        token
      }
    },
    createNote: (_, { title, content }, { req }) => {
      // Autenticação
      const authHeader = req.headers.authorization || '';
      const token = authHeader.replace('Bearer ', '');
      const user = getUserFromToken(token);
      if (!user) throw new Error('Token inválido ou ausente');
      // Create note
      return noteService.createNote({ username: user.username, title, content });
    },
    deleteNote: (_, { id }, { req }) => {
      // Autenticação JWT
      const authHeader = req.headers.authorization || '';
      const token = authHeader.replace('Bearer ', '');
      const user = getUserFromToken(token);
      if (!user) throw new Error('Token inválido ou ausente');
      // Delete note
      const username = user.username;
      const paramId = id;
      noteService.deleteNote({paramId, username});
      return 'Nota excluída com sucesso.';
    }
  }
};
