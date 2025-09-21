const request = require('supertest');
const { expect, use } = require('chai');
const chaiExclude = require('chai-exclude');
use(chaiExclude);

const host = 'http://localhost:4000/graphql';

describe('User external via GraphQL', () => {
    describe('Mutation: register', () => {
        it('Quando tento criar um novo usuário, eu recebo uma mensagem de sucesso', async () => {
            const registroSucesso = require('../fixture/requests/user/registerSucesso.json');
            const resposta = await request(host)
              .post('')
              .send(registroSucesso);
            
            const respostaEsperada = require('../fixture/responses/user/respostaRegisterSucesso.json');
            expect(resposta.body.data.register).to.deep.equal(respostaEsperada);
        });

        it('Quando tento criar um usuário que já, eu recebo uma mensagem de erro', async () => {
            const registroSucesso = require('../fixture/requests/user/registerDuplicado.json');
            const resposta = await request(host)
              .post('')
              .send(registroSucesso);
            
            const respostaEsperada = require('../fixture/responses/user/respostaRegisterDuplicado.json');
            expect(resposta.body.errors[0]).to.include(respostaEsperada);
        });
    });

    describe('Mutation: login', () => {
        it('Quando tento efetuar o login com usuário e senha válidos, eu recebo uma mensagem de sucesso', async () => {
            const loginSucesso = require('../fixture/requests/user/loginSucesso.json');
            const resposta = await request(host)
              .post('')
              .send(loginSucesso);
            
            const respostaEsperada = require('../fixture/responses/user/respostaLoginSucesso.json');
            expect(resposta.body.data.login).to.deep.equal(respostaEsperada);
        });

        it('Quando tento efetuar o login com usuário e senha inválidos, eu recebo uma mensagem de erro', async () => {
            const loginCredenciaisInvalidas = require('../fixture/requests/user/loginCredenciaisInvalidas.json');
            const resposta = await request(host)
              .post('')
              .send(loginCredenciaisInvalidas);
            
            const respostaEsperada = require('../fixture/responses/user/respostaCredenciaisInvalidas.json');
            expect(resposta.body.errors[0]).to.include(respostaEsperada);
        });

        it('Quando tento efetuar o login com sem passar usuário e senha, eu recebo uma mensagem de erro', async () => {
            const loginCamposVazios = require('../fixture/requests/user/loginCamposVazios.json');
            const resposta = await request(host)
              .post('')
              .send(loginCamposVazios);
            
            const respostaEsperada = require('../fixture/responses/user/respostaCredenciaisInvalidas.json');
            expect(resposta.body.errors[0]).to.include(respostaEsperada);
        });
    });
});