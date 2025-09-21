const request = require('supertest');
const { expect, use } = require('chai');
const chaiExclude = require('chai-exclude');
use(chaiExclude);

const host = 'http://localhost:4000/graphql';

describe.skip('Note external via GraphQL', () => {
    describe('Mutation: create note', () => {
        it('', async () => {});
    });

    describe('Mutation: delete note', () => {
        it('', async () => {});
    });
});