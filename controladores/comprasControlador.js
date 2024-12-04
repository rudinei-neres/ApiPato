import ConexaoMySql from '../utils/bancoDeDados.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const buscarUsuarioLogado = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const connection = await new ConexaoMySql().getConexao();
    const [resultado] = await connection.execute(
      "SELECT nome, email, papel FROM usuarios WHERE id_usuario = ?",
      [decoded.id_usuario]
    );

    if (!resultado.length) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    res.status(200).json(resultado[0]);
  } catch (error) {
    console.error("Erro ao buscar usuário logado:", error);
    res.status(500).json({ error: "Erro ao buscar usuário logado." });
  }
};

export const adicionar = async (req, res) => {
  const { nome, email, senha, telefone, carteira } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: "Nome, email e senha são obrigatórios." });
  }

  try {
    const hashedPassword = await bcrypt.hash(senha, 10);
    const connection = await new ConexaoMySql().getConexao();

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

export const buscarCompras = async (req, res) => {
  const { id_usuario } = req.params;

  try {
    const connection = await new ConexaoMySql().getConexao();
    const [compras] = await connection.execute(
      "SELECT * FROM compras WHERE id_usuario = ?",
      [id_usuario]
    );

    res.status(200).json(compras);
  } catch (error) {
    console.error("Erro ao buscar compras:", error);
    res.status(500).json({ error: "Erro ao buscar compras." });
  }
};


export default {
  buscarUsuarioLogado,
  adicionar,
  buscarCompras,
};
