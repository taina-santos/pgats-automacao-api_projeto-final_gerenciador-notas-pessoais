const request = require('supertest');
const { expect, use } = require('chai');
const chaiExclude = require('chai-exclude');
use(chaiExclude);
require('dotenv').config();

const host = process.env.BASE_URL_REST;

const getNotes = '/notes';
const postCreateNote = '/notes/create';
const deleteNoteById = '/notes/';
const postUserLogin = '/users/login';

var token = "";

describe('Note External via REST', () => {
    before(async () => {
        const loginBody = require('../fixture/external/requests/user/requisicaoUserExternalLoginUsuarioValido.json');

        const login = await request(host)
            .post(postUserLogin)
            .send(loginBody);
        
        token = login.body.token;
    });

    describe('GET /notes', () => {
        it('Quando busco por todas as notas pessoais de um usuário, o retorno será 200', async () => {
            const resposta = await request(host).get(getNotes).set('Authorization', `Bearer ${token}`);
            const respostaEsperada = require('../fixture/external/responses/note/respostaNoteExternalGetNotes200.json');

            expect(resposta.status).to.equal(200);
            expect(resposta.body).to.deep.equal(respostaEsperada);
        });

        it('Quando busco por todas as notas pessoais de um usuário sem passar nenhum token, o retorno será 401', async () => {
            const resposta = await request(host).get(getNotes);
            const respostaEsperada = require('../fixture/external/responses/note/respostaNoteExternalToken401.json');

            expect(resposta.status).to.equal(401);
            expect(resposta.body).to.deep.equal(respostaEsperada);
        });

        it('Quando busco por todas as notas pessoais de um usuário enviando um token incorreto, o retorno será 403', async () => {
            const resposta = await request(host).get(getNotes).set('Authorization', `Bearer tokenInvalido`);
            const respostaEsperada = require('../fixture/external/responses/note/respostaNoteExternalToken403.json');

            expect(resposta.status).to.equal(403);
            expect(resposta.body).to.deep.equal(respostaEsperada);
        });
    });

    describe('POST /notes/create', () => {
        it('Quando crio uma nota pessoal com dados válidos, o retorno será 201', async () => {
            const postCreateNoteRequest = require('../fixture/external/requests/note/requisicaoNoteExternalCreateNotaValida.json');

            const resposta = await request(host).post(postCreateNote).set('Authorization', `Bearer ${token}`).send(postCreateNoteRequest);
            const respostaEsperada = require('../fixture/external/responses/note/respostaNoteExternalCreateNote201.json');

            expect(resposta.status).to.equal(201);
            expect(resposta.body).excluding('id').to.deep.equal(respostaEsperada);
        });

        it('Quando crio uma nota pessoal com os campos vazios, o retorno será 400', async () => {
            const postCreateNoteRequest = require('../fixture/external/requests/note/requisicaoNoteExternalCreateCamposVazios.json');

            const resposta = await request(host).post(postCreateNote).set('Authorization', `Bearer ${token}`).send(postCreateNoteRequest);
            const respostaEsperada = require('../fixture/external/responses/note/respostaNoteExternalCreateNote400.json');

            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.deep.equal(respostaEsperada);
        });

        it('Quando crio uma nota pessoal com o JSON vazio, o retorno será 400', async () => {
            const postCreateNoteRequest = require('../fixture/external/requests/note/requisicaoNoteExternalJsonVazio.json');

            const resposta = await request(host).post(postCreateNote).set('Authorization', `Bearer ${token}`).send(postCreateNoteRequest);
            const respostaEsperada = require('../fixture/external/responses/note/respostaNoteExternalCreateNote400.json');

            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.deep.equal(respostaEsperada);
        });

        it('Quando crio uma nota pessoal sem passar nenhum token, o retorno será 401', async () => {
            const postCreateNoteRequest = require('../fixture/external/requests/note/requisicaoNoteExternalCreateNotaValida.json');

            const resposta = await request(host).post(postCreateNote).send(postCreateNoteRequest);
            const respostaEsperada = require('../fixture/external/responses/note/respostaNoteExternalToken401.json');

            expect(resposta.status).to.equal(401);
            expect(resposta.body).to.deep.equal(respostaEsperada);
        });

        it('Quando crio uma nota pessoal enviando um token incorreto, o retorno será 403', async () => {
            const postCreateNoteRequest = require('../fixture/external/requests/note/requisicaoNoteExternalCreateNotaValida.json');

            const resposta = await request(host).post(postCreateNote).set('Authorization', `Bearer tokenInvalido`).send(postCreateNoteRequest);
            const respostaEsperada = require('../fixture/external/responses/note/respostaNoteExternalToken403.json');

            expect(resposta.status).to.equal(403);
            expect(resposta.body).to.deep.equal(respostaEsperada);
        });
    });

    describe('DELETE /notes/:id', () => {
        it('Quando deleto uma nota existente, o retorno será 200', async () => {
            const id = 3;
            
            const resposta = await request(host).del(deleteNoteById + id).set('Authorization', `Bearer ${token}`);
            const respostaEsperada = require('../fixture/external/responses/note/respostaNoteExternalDeleteNote200.json');

            expect(resposta.status).to.equal(200);
            expect(resposta.body).to.deep.equal(respostaEsperada);
        });

        it('Quando deleto uma nota que não existe, o retorno será 404', async () => {
            const id = 0;

            const resposta = await request(host).del(deleteNoteById + id).set('Authorization', `Bearer ${token}`);
            const respostaEsperada = require('../fixture/external/responses/note/respostaNoteExternalDeleteNote404.json');

            expect(resposta.status).to.equal(404);
            expect(resposta.body).to.deep.equal(respostaEsperada);
        });

        it('Quando deleto uma nota que pertence a outro usuário, o retorno será 404', async () => {
            const id = 2;

            const resposta = await request(host).del(deleteNoteById + id).set('Authorization', `Bearer ${token}`);
            const respostaEsperada = require('../fixture/external/responses/note/respostaNoteExternalDeleteNote404.json');

            expect(resposta.status).to.equal(404);
            expect(resposta.body).to.deep.equal(respostaEsperada);
        });

        it('Quando crio uma nota pessoal sem passar nenhum token, o retorno será 401', async () => {
            const id = 3;
            
            const resposta = await request(host).del(deleteNoteById + id);
            const respostaEsperada = require('../fixture/external/responses/note/respostaNoteExternalToken401.json');

            expect(resposta.status).to.equal(401);
            expect(resposta.body).to.deep.equal(respostaEsperada);
        });

        it('Quando crio uma nota pessoal enviando um token incorreto, o retorno será 403', async () => {
            const id = 3;
            
            const resposta = await request(host).del(deleteNoteById + id).set('Authorization', `Bearer tokenInvalido`);
            const respostaEsperada = require('../fixture/external/responses/note/respostaNoteExternalToken403.json');

            expect(resposta.status).to.equal(403);
            expect(resposta.body).to.deep.equal(respostaEsperada);
        });
    });
});