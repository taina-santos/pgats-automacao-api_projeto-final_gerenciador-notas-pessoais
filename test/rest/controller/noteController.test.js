const request = require('supertest');
const sinon = require('sinon');
const { expect, use } = require('chai');

const chaiExclude = require('chai-exclude');
use(chaiExclude);

const app = require('../../../rest/app');
const noteService = require('../../../src/service/noteService');

const getNotes = '/notes';
const postCreateNote = '/notes/create';
const deleteNoteById = '/notes/';
const postUserLogin = '/users/login';

var token = "";

describe('Note Controller', () => {
    before(async () => {
        const loginBody = require('../fixture/controller/requests/requisicaoUserControllerLoginUsuarioValido.json');

        const login = await request(app)
            .post(postUserLogin)
            .send(loginBody);
        
        token = login.body.token;
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('GET /notes', () => {
        it('Quando busco por todas as notas pessoais de um usuário, o retorno será 200', async () => {
            const noteServiceMock = sinon.stub(noteService, 'getNotesByUser');
            noteServiceMock.returns([
              {
                "id": 1,
                "username": "taina",
                "title": "primeira nota",
                "content": "teste do contador"
              },
              {
                "id": 3,
                "username": "taina",
                "title": "segunda nota",
                "content": "adicionando uma segunda nota para validar a busca"
              }
            ]);

            const resposta = await request(app).get(getNotes).set('Authorization', `Bearer ${token}`);
            const respostaEsperada = require('../fixture/controller/responses/respostaNoteControllerGetNotes200.json');

            expect(resposta.status).to.equal(200);
            expect(resposta.body).to.deep.equal(respostaEsperada);
        });

        it('Quando busco por todas as notas pessoais de um usuário sem passar nenhum token, o retorno será 401', async () => {
            const noteServiceMock = sinon.stub(noteService, 'getNotesByUser');
            noteServiceMock.throws(new Error('Token de acesso requerido.'));

            const resposta = await request(app).get(getNotes);
            const respostaEsperada = require('../fixture/controller/responses/respostaNoteControllerToken401.json');

            expect(resposta.status).to.equal(401);
            expect(resposta.body).to.deep.equal(respostaEsperada);
        });

        it('Quando busco por todas as notas pessoais de um usuário enviando um token incorreto, o retorno será 403', async () => {
            const noteServiceMock = sinon.stub(noteService, 'getNotesByUser');
            noteServiceMock.throws(new Error('Token inválido.'));

            const resposta = await request(app).get(getNotes).set('Authorization', `Bearer tokenInvalido`);
            const respostaEsperada = require('../fixture/controller/responses/respostaNoteControllerToken403.json');

            expect(resposta.status).to.equal(403);
            expect(resposta.body).to.deep.equal(respostaEsperada);
        });
    });

    describe('POST /notes/create', () => {
        it('Quando crio uma nota pessoal com dados válidos, o retorno será 201', async () => {
            const postCreateNoteRequest = require('../fixture/controller/requests/requisicaoNoteControllerCreateNotaValida.json');

            const noteServiceMock = sinon.stub(noteService, 'createNote');
            noteServiceMock.returns({
              id: 4,
              username: "taina",
              title: "teste do controller",
              content: "testando o controller do post create note"
            });

            const resposta = await request(app).post(postCreateNote).set('Authorization', `Bearer ${token}`).send(postCreateNoteRequest);
            const respostaEsperada = require('../fixture/controller/responses/respostaNoteControllerCreateNote201.json');

            expect(resposta.status).to.equal(201);
            expect(resposta.body).excluding('id').to.deep.equal(respostaEsperada);
        });

        it('Quando crio uma nota pessoal com os campos vazios, o retorno será 400', async () => {
            const postCreateNoteRequest = require('../fixture/controller/requests/requisicaoNoteControllerCreateCamposVazios.json');

            const noteServiceMock = sinon.stub(noteService, 'createNote');
            noteServiceMock.throws(new Error('Título e conteúdo obrigatórios.'));

            const resposta = await request(app).post(postCreateNote).set('Authorization', `Bearer ${token}`).send(postCreateNoteRequest);
            const respostaEsperada = require('../fixture/controller/responses/respostaNoteControllerCreateNote400.json');

            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.deep.equal(respostaEsperada);
        });

        it('Quando crio uma nota pessoal com o JSON vazio, o retorno será 400', async () => {
            const postCreateNoteRequest = require('../fixture/controller/requests/requisicaoNoteControllerJsonVazio.json');

            const noteServiceMock = sinon.stub(noteService, 'createNote');
            noteServiceMock.throws(new Error('Título e conteúdo obrigatórios.'));

            const resposta = await request(app).post(postCreateNote).set('Authorization', `Bearer ${token}`).send(postCreateNoteRequest);
            const respostaEsperada = require('../fixture/controller/responses/respostaNoteControllerCreateNote400.json');

            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.deep.equal(respostaEsperada);
        });

        it('Quando crio uma nota pessoal sem passar nenhum token, o retorno será 401', async () => {
            const noteServiceMock = sinon.stub(noteService, 'createNote');
            noteServiceMock.throws(new Error('Token de acesso requerido.'));

            const resposta = await request(app).post(postCreateNote);
            const respostaEsperada = require('../fixture/controller/responses/respostaNoteControllerToken401.json');

            expect(resposta.status).to.equal(401);
            expect(resposta.body).to.deep.equal(respostaEsperada);
        });

        it('Quando crio uma nota pessoal enviando um token incorreto, o retorno será 403', async () => {
            const noteServiceMock = sinon.stub(noteService, 'createNote');
            noteServiceMock.throws(new Error('Token inválido.'));

            const resposta = await request(app).post(postCreateNote).set('Authorization', `Bearer tokenInvalido`);
            const respostaEsperada = require('../fixture/controller/responses/respostaNoteControllerToken403.json');

            expect(resposta.status).to.equal(403);
            expect(resposta.body).to.deep.equal(respostaEsperada);
        });
    });

    describe('DELETE /notes/:id', () => {
        it('Quando deleto uma nota existente, o retorno será 200', async () => {
            const id = 3;

            const noteServiceMock = sinon.stub(noteService, 'deleteNote');
            noteServiceMock.returns({
              message: "Nota excluída com sucesso."
            });

            const resposta = await request(app).del(deleteNoteById + id).set('Authorization', `Bearer ${token}`);
            const respostaEsperada = require('../fixture/controller/responses/respostaNoteControllerDeleteNote200.json');

            expect(resposta.status).to.equal(200);
            expect(resposta.body).to.deep.equal(respostaEsperada);
        });

        it('Quando deleto uma nota que não existe, o retorno será 404', async () => {
            const id = 0;

            const noteServiceMock = sinon.stub(noteService, 'deleteNote');
            noteServiceMock.throws(new Error('Nota não encontrada ou não pertence ao usuário.'));

            const resposta = await request(app).del(deleteNoteById + id).set('Authorization', `Bearer ${token}`);
            const respostaEsperada = require('../fixture/controller/responses/respostaNoteControllerDeleteNote404.json');

            expect(resposta.status).to.equal(404);
            expect(resposta.body).to.deep.equal(respostaEsperada);
        });

        it('Quando deleto uma nota que pertence a outro usuário, o retorno será 404', async () => {
            const id = 2;

            const noteServiceMock = sinon.stub(noteService, 'deleteNote');
            noteServiceMock.throws(new Error('Nota não encontrada ou não pertence ao usuário.'));

            const resposta = await request(app).del(deleteNoteById + id).set('Authorization', `Bearer ${token}`);
            const respostaEsperada = require('../fixture/controller/responses/respostaNoteControllerDeleteNote404.json');

            expect(resposta.status).to.equal(404);
            expect(resposta.body).to.deep.equal(respostaEsperada);
        });

        it('Quando crio uma nota pessoal sem passar nenhum token, o retorno será 401', async () => {
            const id = 3;
            const noteServiceMock = sinon.stub(noteService, 'deleteNote');
            noteServiceMock.throws(new Error('Token de acesso requerido.'));

            const resposta = await request(app).del(deleteNoteById + id);
            const respostaEsperada = require('../fixture/controller/responses/respostaNoteControllerToken401.json');

            expect(resposta.status).to.equal(401);
            expect(resposta.body).to.deep.equal(respostaEsperada);
        });

        it('Quando crio uma nota pessoal enviando um token incorreto, o retorno será 403', async () => {
            const id = 3;
            const noteServiceMock = sinon.stub(noteService, 'deleteNote');
            noteServiceMock.throws(new Error('Token inválido.'));

            const resposta = await request(app).del(deleteNoteById + id).set('Authorization', `Bearer tokenInvalido`);
            const respostaEsperada = require('../fixture/controller/responses/respostaNoteControllerToken403.json');

            expect(resposta.status).to.equal(403);
            expect(resposta.body).to.deep.equal(respostaEsperada);
        });
    });
});