// Banco de dados de notes em memória
const notes = [{
        id: 1,
        username: "taina",
        title: "primeira nota",
        content: "teste do contador"
    },
    {
        id: 2,
        username: "rafael",
        title: "primeira nota",
        content: "teste de pegar apenas o que é do user"
    },
    {
        id: 3,
        username: "taina",
        title: "segunda nota",
        content: "adicionando uma segunda nota para validar a busca"
    }
];

module.exports = { notes };
