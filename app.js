require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ppid } = require('process');

const app = express();

app.use(express.json());

const User = require('./models/User');

app.get('/', (req, res) => {
    res.status(200).json({ msg: 'Bem vindo a nossa API!' });
})

app.get('/user/:id', checkToken, async (req, res) => {

    const id = req.params.id;

    const user  = await User.findById(id, '-password');

    if(!user){
        return res.status(404).json({ msg: 'Usuário não encontrado!' });
    }

    res.status(200).json({ user: user });

})

function checkToken(req,res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ msg: 'Você não está autenticado!' });
    }

    try{

        const secret = process.env.SECRET

        jwt.verify(token, secret)

        next();


    } catch (err) {
        return res.status(400).json({ msg: 'Token invalido!' });
    }
}


app.post('/auth/register', async (req, res) => {
    const { name, email, password, confirmpassword } = req.body

    if (!name) {
        return res.status(422).json({ msg: 'O nome é obrigatorio!' })
    };

    if (!email) {
        return res.status(422).json({ msg: 'O email é obrigatorio!' })
    };

    if (!password) {
        return res.status(422).json({ msg: 'A senha é obrigatoria!' })
    };

    if (password !== confirmpassword) {
        return res.status(422).json({ msg: 'As senhas não são iguais!' })
    };

    const userExists = await User.findOne({ email: email });

    if (userExists) {
        return res.status(422).json({ msg: 'Esse email já está cadastrado!' })
    };

    const salt = await bcrypt.genSalt(12);
    const passwordhash = await bcrypt.hash(password, salt);

    const user = new User({
        name,
        email,
        password: passwordhash,
    });

    try {
        await user.save();

        res.status(201).json({ msg: 'Usuário cadastrado com sucesso!' });
       
    } catch (error) {
        console.log(error);

        res.status(500).json({ msg: 'Erro ao cadastrar usuário!' });
    }
})

app.post('/auth/login', async (req, res) => {

    const { email, password } = req.body;


    if (!email) {
        return res.status(422).json({ msg: 'O email é obrigatorio!' })
    };

    if (!password) {
        return res.status(422).json({ msg: 'A senha é obrigatoria!' })
    };


    const user = await User.findOne({ email: email });

    if (!user) {
        return res.status(404).json({ msg: 'Usuario não encontrado!' })
    };

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
        return res.status(422).json({ msg: 'Senha incorreta!' })
    }

    try {

        const secret = process.env.SECRET

        const token = jwt.sign({
            id: user._id,
        }, secret,
        )

        res.status(200).json({ 
            msg: 'Login realizado com sucesso!',
            token: token,
        })

    } catch (err) {
        console.log(err);

        res.status(500).json({ 
            msg: 'Erro ao fazer login!',
        })
    }
})

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

mongoose
    .connect(
        `mongodb+srv://${dbUser}:${dbPassword}@cluster0.38kq80l.mongodb.net/?retryWrites=true&w=majority`
        )
    .then(() => {
        app.listen(3000)
        console.log('Servidor iniciado na porta 3000');
    })
    .catch((err) => console.log(err));