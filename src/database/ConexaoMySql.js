import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Carrega as variáveis do .env
dotenv.config();

const dbConfig = {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PWD,
  database: process.env.MYSQL_DB,
};

class ConexaoMySql {
  constructor() {
    if (!ConexaoMySql.pool) {
      ConexaoMySql.pool = mysql.createPool(dbConfig); // Criação do pool de conexões
    }
  }

  async getConexao() {
    try {
      const conexao = await ConexaoMySql.pool.getConnection(); // Obtém uma conexão do pool
      console.log("Conexão com o banco estabelecida.");
      return conexao;
    } catch (error) {
      console.error("Erro ao obter conexão com o banco:", error);
      throw error;
    }
  }
}

export default ConexaoMySql;
