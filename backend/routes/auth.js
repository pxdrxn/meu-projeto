const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ajuste o caminho conforme sua configuração

const router = express.Router();

// Rota de Cadastro
router.post('/cadastro', async (req, res) => {
    const { nome, email, senha, tipo } = req.body;

    try {
        // Verifica se o usuário já existe
        const usuarioExistente = await User.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({ mensagem: 'Usuário já existe' });
        }

        // Criptografa a senha
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        // Cria o usuário no banco de dados
        const usuario = await User.create({
            nome,
            email,
            senha: senhaCriptografada,
            tipo,
        });

        // Gera o token JWT
        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(201).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro no servidor' });
    }
});

// Rota de Login
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Verifica se o usuário existe
        const usuario = await User.findOne({ where: { email } });
        if (!usuario) {
            return res.status(400).json({ mensagem: 'Credenciais inválidas' });
        }

        // Compara a senha
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(400).json({ mensagem: 'Credenciais inválidas' });
        }

        // Gera o token JWT
        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro no servidor' });
    }
});

module.exports = router;