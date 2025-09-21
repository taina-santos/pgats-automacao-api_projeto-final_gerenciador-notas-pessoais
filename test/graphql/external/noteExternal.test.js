const request = require('supertest');
const { expect, use } = require('chai');
const chaiExclude = require('chai-exclude');
use(chaiExclude);
require('dotenv').config();

const host = process.env.BASE_URL_GRAPHQL;

var token = "";
var username = "";

describe.only('Note external via GraphQL', () => {
    before(async () => {
        const loginBody = require('../fixture/requests/user/loginSucessoPegarToken.json');

        const login = await request(host)
            .post('')
            .send(loginBody);
        
        token = login.body.data.login.token;
        username = login.body.data.login.user.username;
    });

    describe('Mutation: create note', () => {
        it('Quando crio uma nota pessoal com dados válidos, o retorno será de sucesso', async () => {
            const createNoteSucesso = require('../fixture/requests/note/createNoteDadosValidos.json');

            const createNote = await request(host)
                .post('')
                .set('Authorization', `Bearer ${token}`)
                .send(createNoteSucesso);
            
            const respostaEsperada = require('../fixture/responses/note/createNoteSucesso.json');
            expect(createNote.body.data.createNote).excluding('id').to.deep.equal(respostaEsperada);
        });

        it('Quando crio uma nota pessoal com dados válidos, mas sem enviar o token, eu recebo uma mensagem de erro', async () => {
            const createNoteSucesso = require('../fixture/requests/note/createNoteDadosValidos.json');

            const createNote = await request(host)
                .post('')
                .send(createNoteSucesso);
            
            const respostaEsperada = require('../fixture/responses/note/noteMessagemTokenInvalido.json');
            expect(createNote.body.errors[0]).to.include(respostaEsperada);
        });
    });

    describe('Mutation: delete note', () => {
        it('Quando excluo uma nota pessoal que me pertence, eu recebo um sucesso', async () => {
            const deleteNoteSucesso = require('../fixture/requests/note/deleteNoteIdValido.json');

            const deleteNote = await request(host)
                .post('')
                .set('Authorization', `Bearer ${token}`)
                .send(deleteNoteSucesso);
            
            const respostaEsperada = require('../fixture/responses/note/deleteNoteSucesso.json');
            expect(deleteNote.body.data).to.deep.equal(respostaEsperada);
        });

        it('Quando excluo uma nota pessoal que não existe e me pertence, eu recebo uma mensagem de erro', async () => {
            const deleteNoteErro = require('../fixture/requests/note/deleteNoteIdInvalido.json');

            const deleteNote = await request(host)
                .post('')
                .set('Authorization', `Bearer ${token}`)
                .send(deleteNoteErro);
            
            const respostaEsperada = require('../fixture/responses/note/deleteNoteErro.json');
            expect(deleteNote.body.errors[0]).to.include(respostaEsperada);
        });

        it('Quando crio uma nota pessoal com dados válidos, mas sem enviar o token, eu recebo uma mensagem de erro', async () => {
            const deleteNoteSucesso = require('../fixture/requests/note/deleteNoteIdValido.json');

            const deleteNote = await request(host)
                .post('')
                .send(deleteNoteSucesso);
            
            const respostaEsperada = require('../fixture/responses/note/noteMessagemTokenInvalido.json');
            expect(deleteNote.body.errors[0]).to.include(respostaEsperada);
        });
    });
});