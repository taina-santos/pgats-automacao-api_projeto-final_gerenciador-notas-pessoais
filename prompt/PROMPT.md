# Prompts utilizados no projeto final da disciplina

Os prompts utilizados abaixo foram um versão modificada vista durante as aulas da disciplina de Automação de Testes na Camada de Serviço (API), do programa PGATS (Pós Graduação em Automação de Teste de Software). O projeto foi criado com modo agent e usando o modelo GPT-4.1 do github copilot.

## Prompt para criar projeto
Crie uma API Rest com Javascript e Express para permitir login, registro de usuário, consulta de usuários com a informação de quantas notais pessoais ele possui e a lista de notas pessoais, consulta de notas pessoais por usuário, criação de notas pessoais e exclusão de notas pessoias. Trata-se de uma API que será utilizada para aprender testes e automação a nível de API, logo, implemente algumas regras básicas de login e de notas pessoais, como:

 1) login e senha devem ser informados ao logar, 
 2) não deve ser possível registrar usuários duplicados, 
 3) o usuário só pode consultar, criar e excluir suas próprias notas pessoais. 

O banco de dados será em memória, armazenando dados em variáveis. O diretório da aplicação deve ser divido em controller, service e model. Separe um arquivo para o app.js e outro para o server.js, pois posteriormente essa API será testada com Supertest, que precisará importar o app sem o método listen(). Adote o uso de Swagger para documentar a API Rest, crie o arquivo swagger.json com a documentação e disponibilize um endpoint para renderização do Swagger. Atualize o arquivo README.md para documentar como configurar e operar a API.



## Prompt para adicionar JWT
Objetivo:
Implementar autenticação via Bearer Token (JWT) para as rotas de transferências (tanto no Swagger quanto no projeto em si).

Contexto:
Já possuo operações de registro e login do usuário, mas agora quero ter a possibilidade de limitar o acesso a todas as ações de consultar, criar e excluir notas pessoais com base no JWT obtido no login.

Regras:
1) Faça uso de validador de autenticação que atinga a rota de transferências
2) Caso a rota de Login ainda não retorne o token JWT, implemente essa funcionalidade
3) Não altere meus testes, eu farei isso sozinho