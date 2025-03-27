const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ajuste o caminho conforme sua configuração

const Problem = sequelize.define('Problem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    modelo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    desc: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    clienteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

// Sincroniza o modelo com o banco de dados (cria a tabela se não existir)
sequelize.sync();

module.exports = Problem;