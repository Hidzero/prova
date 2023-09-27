const express = require('express');

const routes  = express.Router();
const users = [{
    id: 1,
    name: 'Lucas',
    email: 'lucas@lucas.com',
    password: '123456'
}]

routes.post('/login', (req, res) => {
    const { email, password } = req.body;

    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
        return res.status(200).json({ user });
    }
     res.status(401).json({ msg: 'Email ou senha invalidos!' });
})

module.exports = routes;