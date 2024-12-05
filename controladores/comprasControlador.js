import ConexaoMySql from '../utils/bancoDeDados.js';
import bcrypt from 'bcryptjs';





export const adicionar = async (req, res) => {
  const { nome, email, senha, telefone, carteira } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: "Nome, email e senha são obrigatórios." });
  }

  try {
    const connection = await new ConexaoMySql().getConexao();

    // Verifica se o email já existe
    const [existente] = await connection.execute(
      "SELECT COUNT(*) as total FROM usuarios WHERE email = ?",
      [email]
    );
    if (existente[0].total > 0) {
      return res.status(409).json({ error: "Este email já está cadastrado." });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const telefoneFormatado = telefone || null;
    const carteiraInicial = carteira || 0;

    await connection.execute(
      "INSERT INTO usuarios (nome, email, senha, telefone, carteira) VALUES (?, ?, ?, ?, ?)",
      [nome, email, hashedPassword, telefoneFormatado, carteiraInicial]
    );

    res.status(201).json({ message: "Usuário registrado com sucesso." });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({ error: "Erro ao registrar usuário." });
  }
};

// Buscar compras de um usuário
export const buscarCompras = async (req, res) => {
  const { id_usuario } = req.params;

  if (!id_usuario) {
    return res.status(400).json({ error: "ID do usuário é obrigatório." });
  }

  try {
    const connection = await new ConexaoMySql().getConexao();
    const [compras] = await connection.execute(
      "SELECT * FROM compras WHERE id_usuario = ?",
      [id_usuario]
    );

    if (compras.length === 0) {
      return res.status(200).json([]); // Retorna lista vazia ao invés de 404
    }

    res.status(200).json(compras);
  } catch (error) {
    console.error("Erro ao buscar compras:", error);
    res.status(500).json({ error: "Erro ao buscar compras." });
  }
};

export default {
  adicionar,
  buscarCompras,
};
