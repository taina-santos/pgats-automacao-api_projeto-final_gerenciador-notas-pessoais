const request = require('supertest');
const { expect, use } = require('chai');
const chaiExclude = require('chai-exclude');
use(chaiExclude);
require('dotenv').config();

const host = process.env.BASE_URL_REST;

const postUserRegister = '/users/register';
const postUserLogin = '/users/login';
const getUser = '/users';

describe('User External via REST', () => {
    describe('POST /users/register', () => {
        it('Quando registro um usuário com campos válidos, o retorno será 201', async () => {
            const postRegisterRequest = require('../fixture/external/requests/user/requisicaoUserExternalRegisterSucesso.json');

            const resposta = await request(host).post(postUserRegister).send(postRegisterRequest);
            const respostaEsperada = require('../fixture/external/responses/user/respostaUserExternalRegister201.json');
            
            expect(resposta.status).to.equal(201);
            expect(resposta.body).to.deep.equal(respostaEsperada);
        });

        it('Quando tento registrar um usuário já existente, o retorno será 409', async () => {
            const postRegisterRequest = require('../fixture/external/requests/user/requisicaoUserExternalRegisterUsuarioExistente.json');

            const resposta = await request(host).post(postUserRegister).send(postRegisterRequest);
            const respostaEsperada = require('../fixture/external/responses/user/respostaUserExternalRegister409.json');

            expect(resposta.status).to.equal(409);
            expect(resposta.body).to.deep.equal(respostaEsperada);
        });

        it('Quanto tento registrar com todos os campos vazios, o retorno será 400', async () => {
            const postRegisterRequest = require('../fixture/external/requests/user/requisicaoUserExternalRegisterCamposVazios.json');

            const resposta = await request(host).post(postUserRegister).send(postRegisterRequest);
            const respostaEsperada = require('../fixture/external/responses/user/respostaUserExternalRegister400.json');

            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.deep.equal(respostaEsperada);
        });
    });

    describe('POST /users/login', () => {
        it('Quando efetuo o login com um usuário e senha válidos, o retorno será 200', async () => {
            const postLoginRequest = require('../fixture/external/requests/user/requisicaoUserExternalLoginUsuarioValido.json');

            const resposta = await request(host).post(postUserLogin).send(postLoginRequest);
            const respostaEsperada = require('../fixture/external/responses/user/respostaUserExternalLogin200.json');

            expect(resposta.status).to.equal(200);
            expect(resposta.body).excluding('token').to.deep.equal(respostaEsperada);
        });

        it('Quando efetuo o login com um usuário válido e senha inválida, o retorno será 401', async () => {
            const postLoginRequest = require('../fixture/external/requests/user/requisicaoUserExternalLoginCredenciaisInvalidas.json');

            const resposta = await request(host).post(postUserLogin).send(postLoginRequest);
            const respostaEsperada = require('../fixture/external/responses/user/respostaUserExternalLogin401.json');

            expect(resposta.status).to.equal(401);
            expect(resposta.body).to.deep.equal(respostaEsperada);
        });

        it('Quando efetuo o login com campos vazios, o retorno será 400', async () => {
            const postLoginRequest = require('../fixture/external/requests/user/requisicaoUserExternalLoginCamposVazios.json');

            const resposta = await request(host).post(postUserLogin).send(postLoginRequest);
            const respostaEsperada = require('../fixture/external/responses/user/respostaUserExternalLogin400.json');

            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.deep.equal(respostaEsperada);
        });

        it('Quando efetuo o login com json vazio, o retorno será 400', async () => {
            const postLoginRequest = require('../fixture/external/requests/user/requisicaoUserExternalLoginJsonVazio.json');

            const resposta = await request(host).post(postUserLogin).send(postLoginRequest);
            const respostaEsperada = require('../fixture/external/responses/user/respostaUserExternalLogin400.json');

            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.deep.equal(respostaEsperada);
        });
    });

    describe('GET /users', () => {
        it('Quando busco por todos os usuários, o retorno será 200', async () => {
            const resposta = await request(host).get(getUser);
            expect(resposta.status).to.equal(200);
        });
    });
});