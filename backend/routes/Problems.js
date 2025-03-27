const express = require('express');
const router = express.Router();
const { Sequelize, DataTypes } = require('sequelize');
const authMiddleware = require('../middlewares/auth'); // Importa o middleware de autenticação
const Problem = require('../models/Problems'); // Certifique-se de que o caminho está correto

router.post('/problems', authMiddleware, async (req, res) => {
    const { modelo, desc } = req.body;
    const clienteId = req.usuario.id; // Obtém o ID do usuário logado a partir do token

    try {
        // Valida os dados recebidos
        if (!modelo || !desc) {
            return res.status(400).json({ mensagem: 'Modelo e descrição são obrigatórios' });
        }

        // Cria o problema no banco de dados
        const problema = await Problem.create({
            modelo,
            desc,
            clienteId, // Associa o problema ao usuário logado
        });

        res.status(201).json(problema); // Retorna o problema criado
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro no servidor' });
    }
});

module.exports = router;