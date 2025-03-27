const { Sequelize } = require('sequelize');

// Configuração do banco de dados (SQLite para exemplo)
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite', // Altere para o seu banco de dados real (ex: PostgreSQL)
});

module.exports = sequelize;