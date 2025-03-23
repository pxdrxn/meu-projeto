const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Configuração do banco de dados (SQLite para exemplo)
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite', // Altere para o seu banco de dados real (ex: PostgreSQL)
});

// Definição do modelo de usuário
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'cliente', // Ou 'prestador'
    },
});

// Sincroniza o modelo com o banco de dados (cria a tabela se não existir)
sequelize.sync();

// Criação do aplicativo Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
    res.send('Backend está funcionando!');
});

// Rota de Cadastro
app.post('/api/auth/cadastro', async (req, res) => {
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
app.post('/api/auth/login', async (req, res) => {
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

// Middleware de autenticação
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ mensagem: 'Acesso negado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (error) {
        res.status(400).json({ mensagem: 'Token inválido' });
    }
};

// Rota Protegida (exemplo)
app.get('/api/protegida', authMiddleware, (req, res) => {
    res.json({ mensagem: 'Rota protegida acessada com sucesso!' });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});