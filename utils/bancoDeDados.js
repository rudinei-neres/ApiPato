import dotenv from 'dotenv'; // Importando dotenv para carregar variáveis de ambiente
import mysql from 'mysql2/promise'; // Importando mysql2 com a interface de promessas

dotenv.config(); // Carrega variáveis de ambiente do arquivo .env

// Criação da conexão com o pool de banco de dados
const db = mysql.createPool({
  host: process.env.MYSQL_HOST , // Host do banco de dados
  port: process.env.MYSQL_PORT , // Porta do banco de dados
  user: process.env.MYSQL_USER , // Usuário do banco de dados
  password: process.env.MYSQL_PWD , // Senha do banco de dados
  database: process.env.MYSQL_DB , // Nome do banco de dados
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default db; // Exportando a conexão pool como default
