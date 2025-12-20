import { sleep, check, group } from 'k6';
import * as dataHelpers from './helpers/dataHelpers.js';
import * as requestHelpers from './helpers/requestHelpers.js';
import * as getRoutes  from './helpers/routes.js';
import { Trend } from 'k6/metrics';

const registerTrend = new Trend('post_register_duration');
const loginTrend = new Trend('post_login_duration');
const createNotesTrend = new Trend('post_create_notes_duration');

export const options = {
  stages: [
    { duration: '10s', target: 4 },
    { duration: '20s', target: 7 },
    { duration: '30s', target: 10 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<=500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function() {
  const username = dataHelpers.generateUsername();
  const password = dataHelpers.generatePassword();

  var responseRegister;
  var responseLogin;
  var responseCreateNotes;

  var token;

  // Registrar usuário no sistema de notas pessoais
  group('Registrando usuário', function() {
    const url = `${getRoutes.BASE_URL}${getRoutes.registerUser}`;
    responseRegister = requestHelpers.registerUser(username, password, url);
    check(responseRegister, { "User registered successfully": (res) => res.status === 201 });
    registerTrend.add(responseRegister.timings.duration);
  });
  
  // Efetuar login do usuário após o registro
  group('Efetuando login', function() {
    const url = `${getRoutes.BASE_URL}${getRoutes.login}`;
    responseLogin = requestHelpers.login(username, password, url);
    check(responseLogin, { 
        "Successfully logged in": (res) => res.status === 200,
        "Token is present": (res) => res.json('token') !== undefined
      });
    loginTrend.add(responseLogin.timings.duration);
  });

  token = requestHelpers.getToken(responseLogin);

  // Criação de notas pessoas após o login do usuário
  group('Criando notas pessoais', function() {
    const url = `${getRoutes.BASE_URL}${getRoutes.createNotes}`;
    const noteData = dataHelpers.generateNoteData();
    responseCreateNotes = requestHelpers.createNotes(noteData.title, noteData.content, token, url);
    check(responseCreateNotes, { "Notes created with success": (res) => res.status === 201 });
    createNotesTrend.add(responseCreateNotes.timings.duration);
  });

  sleep(1);
}
