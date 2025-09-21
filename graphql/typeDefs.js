const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    username: String!
    notesCount: Int!
  }

  type Login {
    message: String!
    user: User!
    token: String!
  }

  type Note {
    id: ID!
    title: String!
    content: String!
    username: String!
  }

  type Query {
    users: [User]
    notes: [Note]
  }

  type Mutation {
    register(username: String!, password: String!): User!
    login(username: String!, password: String!): Login!
    createNote(title: String!, content: String!): Note!
    deleteNote(id: ID!): String!
  }
`;
