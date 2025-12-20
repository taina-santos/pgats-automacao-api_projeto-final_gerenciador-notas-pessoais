import { sleep, check, group } from 'k6';
import * as requestHelpers from './helpers/requestHelpers.js';
import * as getRoutes  from './helpers/routes.js';
import { Trend } from 'k6/metrics';
import { SharedArray } from 'k6/data';

const loginTrend = new Trend('post_login_duration');

const usersData = new SharedArray('Users', function () {
  return JSON.parse(open('./data/login.test.data.json'));
});

export const options = {
  vus: 10,
  iterations: 10,
  thresholds: {
    http_req_duration: ['p(95)<=500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function() {
  const user = usersData[(__VU - 1) % usersData.length];

  var responseLogin;

  // Efetuar login do usuário após o registro
  group('Efetuando login', function() {
    const url = `${getRoutes.BASE_URL}${getRoutes.login}`;
    responseLogin = requestHelpers.login(user.username, user.password, url);
    check(responseLogin, { 
        "Successfully logged in": (res) => res.status === 200,
        "Token is present": (res) => res.json('token') !== undefined
      });
    loginTrend.add(responseLogin.timings.duration);
  });

  sleep(1);
}
