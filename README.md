# pgats-automacao-api_projeto-final_gerenciador-notas-pessoais
Projeto de gerenciador de notas pessoas, utilizado como projeto final da disciplina de automação de testes na camada de serviço do PGATS

## Instalação

1. Instale as dependências:
   ```powershell
   npm install express swagger-ui-express
   ```

## Executando a API

- Para iniciar o servidor:
  ```powershell
  node server.js
  ```
- A API estará disponível em `http://localhost:3000`.

## Endpoints principais

- `POST /users/register` — Registro de usuário
- `POST /users/login` — Login (retorna token)
- `GET /users` — Consulta usuários, quantidade e lista de notas
- `GET /notes` — Consulta notas do usuário logado (requer token)
- `POST /notes` — Criação de nota (requer token)
- `DELETE /notes/{id}` — Exclusão de nota (requer token)

## Autenticação

- Após login, utilize o token retornado no header `Authorization` como `Bearer <token>` para acessar endpoints protegidos.

## Documentação Swagger

- Acesse a documentação interativa em: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Observações

- O banco de dados é em memória, os dados são perdidos ao reiniciar o servidor.
- Não é permitido registrar usuários duplicados.
- Usuários só podem consultar, criar e excluir suas próprias notas pessoais.
