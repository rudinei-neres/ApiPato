require('dotenv').config(); // Carrega variáveis de ambiente do arquivo .env
const mysql = require('mysql2/promise');

// Criação da conexão com o pool de banco de dados
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost', // Host do banco de dados
  port: process.env.MYSQL_PORT || 3306, // Porta do banco de dados
  user: process.env.MYSQL_USER || 'root', // Usuário do banco de dados
  password: process.env.MYSQL_PWD || '', // Senha do banco de dados
  database: process.env.MYSQL_DB || 'railway', // Nome do banco de dados
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;

