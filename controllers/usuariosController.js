import ConexaoMySql from '../database/conexaoMySql.js';
import bcrypt from 'bcryptjs';

const adicionar = async (req, res) => {
  const { nome, email, senha, telefone, carteira } = req.body;
  
  // Validação de campos obrigatórios
  if (!nome || !email || !senha) {
    return res.status(400).json({ error: "Nome, email e senha são obrigatórios." });
  }

  try {
    // Criação do hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10);
    const connection = await new ConexaoMySql().getConexao();

    // Inserção do usuário no banco de dados
    await connection.execute(
      "INSERT INTO usuarios (nome, email, senha, telefone, carteira) VALUES (?, ?, ?, ?, ?)",
      [nome, email, hashedPassword, telefone, carteira || 0]
    );

    res.status(201).json({ message: "Usuário registrado com sucesso." });

  } catch (error) {
    console.error("Erro ao registrar usuário:", error);

    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: "Este email já está cadastrado." });
    } else {
      res.status(500).json({ error: "Erro ao registrar usuário." });
    }
  }
};

export default {
  adicionar,
};
