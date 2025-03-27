const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ajuste o caminho conforme necessário

const router = express.Router();

/**
 * @swagger
 * /api/auth/cadastro:
 *   post:
 *     summary: Cadastra um novo usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 example: joao@example.com
 *               senha:
 *                 type: string
 *                 example: 123456
 *               tipo:
 *                 type: string
 *                 enum: [cliente, prestador]
 *                 example: cliente
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT gerado para o usuário
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Usuário já existe
 *       500:
 *         description: Erro no servidor
 */
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

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Faz login de um usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: joao@example.com
 *               senha:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT gerado para o usuário
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Credenciais inválidas
 *       500:
 *         description: Erro no servidor
 */
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