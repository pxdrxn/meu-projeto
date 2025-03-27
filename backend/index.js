const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth'); // Importa as rotas de autenticação
const problemRoutes = require('../backend/routes/Problems'); // Importa as rotas de problemas
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

// Configuração do Swagger (opcional, se estiver usando)
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API do Meu Projeto',
            version: '1.0.0',
            description: 'Documentação da API do Meu Projeto',
        },
        servers: [
            {
                url: 'http://localhost:5000', // URL do servidor
            },
        ],
    },
    apis: ['./routes/*.js'], // Arquivos onde estão as rotas
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

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

// Usa as rotas de autenticação
app.use('/api/auth', authRoutes);

// Usa as rotas de problemas
app.use('/api', problemRoutes);

// Rota para a documentação do Swagger (opcional)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});