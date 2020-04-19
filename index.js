const express = require('express');
const server = express();

server.use(express.json());

const users = ['Acaciano Neves', 'Amanda Ellen', 'Rick Souza'];

server.use((req, res, next) => {
    console.log(`Método: ${req.method}; URL: ${req.url}`);
    return next();
});

function validationModel(req, res, next) {
    if (!req.body.name) {
        return res.status(400).json({ error: 'Usuário não informado!' });
    }
    return next();
}

function checkUserInArray(req, res, next) {
    const user = users[req.params.index];

    if (!users[req.params.index]) {
        return res.status(400).json({ error: 'Usuário não encontrado!' });
    }
    req.user = user;

    return next();
}

server.get('/v1/users', (req, res) => {
    return res.json({ ok: true, data: users });
});

server.get('/v1/users/:index', checkUserInArray, (req, res) => {
    return res.json({ ok: true, data: req.user });
});

server.post('/v1/users', validationModel, (req, res) => {
    const { name } = req.body;

    users.push(name);
    return res.json({ ok: true, message: 'Usuário cadastrado com sucesso!' });
});

server.put('/v1/users/:index', checkUserInArray, validationModel, (req, res) => {
    const { index } = req.params;
    const { name } = req.body;

    users[index] = name;
    return res.json({ ok: true, message: 'Usuário alterado com sucesso!' });
});

server.delete('/v1/users/:index', checkUserInArray, (req, res) => {
    const { index } = req.params;

    users.splice(index, 1);
    return res.json({ ok: true, message: 'Usuário deletado com sucesso!' });
});

server.listen(3000);