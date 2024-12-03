import dotenv from 'dotenv'; // Importando dotenv para carregar variáveis de ambiente
import mysql from 'mysql2/promise'; // Importando mysql2 com a interface de promessas

dotenv.config(); // Carrega variáveis de ambiente do arquivo .env

// Criação da conexão com o pool de banco de dados
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'junction.proxy.rlwy.net', // Host do banco de dados
  port: process.env.MYSQL_PORT || 48875, // Porta do banco de dados
  user: process.env.MYSQL_USER || 'root', // Usuário do banco de dados
  password: process.env.MYSQL_PWD || 'rUDFGzcCTByGhzUMTpfHZhFLPCXKcuD', // Senha do banco de dados
  database: process.env.MYSQL_DB || 'railway', // Nome do banco de dados
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool; // Exportando a conexão pool como default
