# Gerenciador de notas pessoais

Projeto de gerenciador de notas pessoas, criado e utilizado como projeto final da disciplina de Automação de Testes na Camada de Serviço (API) do PGATS.

## Regras de negócio

- O projeto permite registrar usuários
  - Não é possível criar usuários duplicados
- O projeto permite o usuário fazer login
  - O token deverá ser retornado ao efetuar login
- Cada usuário pode efetuar as seguintes operações:
  - Consultar suas próprias notas
  - Criar novas notas
  - Excluir suas próprias notas
- O usuário não pode consultar ou excluir notas de outros usuários

## Observações

- O banco de dados é em memória, os dados são perdidos ao reiniciar o servidor

## Instalação

1. Instale as dependências:
   ```powershell
   npm install 
   ```

## Executando a API Rest

- Para iniciar o servidor:
  ```powershell
  npm start
  ```
  OU
  ```powershell
  node rest/server.js
  ```
- A API estará disponível em `http://localhost:3000`.

### Endpoints principais

- `POST /users/register` — Registro de usuário
- `POST /users/login` — Login
- `GET /users` — Consulta usuários e quantidade notas que possui
- `GET /notes` — Consulta notas do usuário logado (requer token)
- `POST /notes` — Criação de nota (requer token)
- `DELETE /notes/{id}` — Exclusão de nota (requer token)

### Autenticação

- Após login, utilize o token retornado no header `Authorization` como `Bearer <token>` para acessar endpoints protegidos.

### Documentação Swagger

- Acesse a documentação interativa em: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
