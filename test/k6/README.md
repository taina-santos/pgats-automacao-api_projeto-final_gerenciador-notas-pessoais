# Gerenciador de notas pessoais

Criado na disciplina de API, utilizaremos o projeto para a disciplina de teste de performance com a ferramenta k6.

## Estrutura e cenários

Para adicionar os testes com k6, foi adicionado a pasta `k6` na pasta de `test`, onde está localizado os scripts para dois cenários, além de pastas que de suporte para dados e helpers. Além disso, o report é gerado numa pasta a parte de mesmo nome.

Os cenários criados para a aplicação dos conceitos em aula foram:

- Efetuar login (`POST /users/login`);
- Criar notas pessoais (`POST /notes/create`).

## Aplicação dos conceitos

### Thresholds e Stages

No arquivo `test/k6/create-notes-performance.test.js`, na definição da execução do script, eu utilizo o uso de `stages` para simular o uso crescente de virtual users, com ramp up e ramp down, quantos usuários quero atingir e a duração.

Além disso, eu defino o `thresholds` para o critério de sucesso e falha, onde ao menos 95% das requisições não devem ultrapassar 500ms e falha se um percentual superior a 1% das requisições resultarem em erro.

````
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
````

### Groups e Checks

No arquivo `test/k6/create-notes-performance.test.js`, os testes foram estruturados por blocos usando o `group`, facilitadno e legibilidade do código, separando as etapas do processo (registrar usuário, login e criar notas).

````
group('Registrando usuário', function() {
    [...]
});
  
group('Efetuando login', function() {
    [...]
});

group('Criando notas pessoais', function() {
    [...]
});
````

Além disso, dentro de cada group, eu utilizo o `checks` para validar se as requisições retornam os critérios estabelecidos, como status code e a presença de variáveis no corpo do body.

````
check(responseLogin, { 
    "Successfully logged in": (res) => res.status === 200,
    "Token is present": (res) => res.json('token') !== undefined
});
````

### Variável de Ambiente e Helpers

Visando em melhorar a legibilidade e manutenção do código, eu apliquei o uso de helpers através da pasta `test/k6/helpers` e concentrei todos os arquivos necessários para execuções de funcionalidades como login ou receber o token.

No arquivo `test/k6/helpers/routes.js`, eu tenho todas as rotas a serem utilizadas no projeto, além de definir o `BASE_URL`, alimentando através da variável de ambiente passada por linha de comando ou com valor padrão caso o usuário não passe esse valor.

````
export const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
````

Já no arquivo de `test/k6/helpers/requestHelpers.js`, eu criei funções para todas as requisições feita nos testes, facilitando a manutenção e o reuso de código, já que funcionalidades como login é utilizada também no teste `test/k6/login-performance.test.js`

````
export function login(username, password, url) {
    const response = http.post(`${url}`, 
        JSON.stringify({
            "username": username,
            "password": password
        }),
        {
            headers: { 'Content-Type': 'application/json' },
        }
    );
    return response;
}
````

### Reaproveitamento de Resposta e Uso de Token de Autenticação

Para reaproveitamento de resposta, no arquivo `test/k6/helpers/requestHelpers.js` eu tenho o método que retorna o valor token caso esteja presente no body de resposta.

````
export function getToken(response) {
    return response.json('token');
}
````

Esse método `getToken` é chamado no arquivo `test/k6/create-notes-performance.test.js` após a execução do método de login e alimenta a variável `token`, que será usada como parâmetro para o método `POST notes/create`

````
token = requestHelpers.getToken(responseLogin);

group('Criando notas pessoais', function() {
    [...]
    responseCreateNotes = requestHelpers.createNotes(noteData.title, noteData.content, token, url);
    [...]
});
````

### Faker

Para criação de dados ao registrar usuário, eu utilizo de outro helper, encontrado em `test/k6/helpers/dataHelpers.js`, para geração de dados usando a biblioteca ``Faker`` do k6. Dessa forma eu consigo garantir usuários únicos e senhas criadas.

````
export function generateUsername() {
    const username = faker.person.firstName();
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2);
    return `${username}-${id}`;
}

export function generatePassword() {
    return faker.internet.password();
}
````

Outro uso do faker foi para a criação de notas pessoais, onde eu uso o `Faker` para dar título e conteúdo para cada nota criada, de forma a não ter notas pessoais com conteúdo repetido, havendo um comportamento mais próximo do mundo real.

````
export function generateNoteData() {
    const title = faker.word.word();
    const content = faker.word.paragraph();
    return {
        title: title,
        content: content
    };
}
````

### Trends

Para ter métricas específicas sobre a duração de request de cada endpoint, eu faço o uso de `trends`. Após a definição de cada trend, eu alimento seus valores durante a execução do script

````
const registerTrend = new Trend('post_register_duration');
const loginTrend = new Trend('post_login_duration');
const createNotesTrend = new Trend('post_create_notes_duration');

registerTrend.add(responseRegister.timings.duration);
loginTrend.add(responseLogin.timings.duration);
createNotesTrend.add(responseCreateNotes.timings.duration);
````

O resultado pode ser conferido após a execução dos scripts da seguinte forma:

````
CUSTOM
post_create_notes_duration.....: avg=1.539504 min=0.604 med=1.507  max=14.331  p(90)=2.1378 p(95)=2.2983
post_login_duration............: avg=1.813183 min=0.651 med=1.793  max=5.61    p(90)=2.477  p(95)=2.6899
post_register_duration.........: avg=2.146834 min=0.531 med=1.684  max=14.28   p(90)=3.7108 p(95)=5.0188
````

### Data-Driven Testing

Para validação do endpoint `POST /users/login`, eu criei o json `test/k6/data/login.test.data.json`, onde contém os usuários registrados na base de dados do gerenciador de notas.

No arquivo `test/k6/login-performance.test.js`, eu leio o arquivo e antes da execução, eu faço a interação com cada objeto dentro desse json durante os testes.

````
const usersData = new SharedArray('Users', function () {
  return JSON.parse(open('./data/login.test.data.json'));
});

export default function() {
  const user = usersData[(__VU - 1) % usersData.length];
  [...]
}
````

## Execução dos testes e relatórios

Para a execução dos testes em k6, eu utilizo o terminal e executo a seguinte linha de comando:

```powershell
k6 run ./test/k6/create-notes-performance.test.js
```

Além disso, é possível criar relatórios para visualizar no navegador ou gerar o HTML para registro e uso posterior. Para isso, é preciso utilizar as variáveis `K6_WEB_DASHBOARD`, passando o valor `true` como parâmetro e exportando o resultado na pasta selecionada através da variável `K6_WEB_DASHBOARD_EXPORT`

```powershell
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=.test/k6/report/create-notes-report.html k6 run ./test/k6/create-notes-performance.test.js
```