import ConexaoMySql from "../database/ConexaoMySql.js";
import bcryptjs from "bcryptjs"; // Adicionada a importação de bcryptjs

class UsuariosController {
  // Listar todos os usuários
  async listar(req, resp) {
    try {
      const conexao = await new ConexaoMySql().getConexao();
      const [usuarios] = await conexao.execute("SELECT id_usuario, email, saldo FROM usuarios");
      resp.status(200).json(usuarios);
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      resp.status(500).json({ error: "Erro ao listar usuários." });
    }
  }

  // Adicionar um novo usuário
  async adicionar(req, resp) {
    try {
      const { email, senha, saldo } = req.body;

      if (!email || !senha) {
        return resp.status(400).json({ error: "Email e senha são obrigatórios." });
      }

      const conexao = await new ConexaoMySql().getConexao();
      const senhaHash = await bcryptjs.hash(senha, 10);
      await conexao.execute(
        "INSERT INTO usuarios (email, senha, saldo) VALUES (?, ?, ?)",
        [email, senhaHash, saldo || 0]
      );

      resp.status(201).json({ message: "Usuário adicionado com sucesso." });
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error);
      resp.status(500).json({ error: "Erro ao adicionar usuário." });
    }
  }

  // Atualizar informações de um usuário
  async atualizar(req, resp) {
    try {
      const { id_usuario, email, saldo } = req.body;

      if (!id_usuario) {
        return resp.status(400).json({ error: "ID do usuário é obrigatório." });
      }

      const conexao = await new ConexaoMySql().getConexao();
      const [resultado] = await conexao.execute(
        "UPDATE usuarios SET email = ?, saldo = ? WHERE id_usuario = ?",
        [email, saldo, id_usuario]
      );

      if (resultado.affectedRows === 0) {
        return resp.status(404).json({ error: "Usuário não encontrado." });
      }

      resp.status(200).json({ message: "Usuário atualizado com sucesso." });
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      resp.status(500).json({ error: "Erro ao atualizar usuário." });
    }
  }

  // Excluir um usuário
  async excluir(req, resp) {
    try {
      const { id_usuario } = req.params;

      if (!id_usuario) {
        return resp.status(400).json({ error: "ID do usuário é obrigatório." });
      }

      const conexao = await new ConexaoMySql().getConexao();
      const [resultado] = await conexao.execute("DELETE FROM usuarios WHERE id_usuario = ?", [id_usuario]);

      if (resultado.affectedRows === 0) {
        return resp.status(404).json({ error: "Usuário não encontrado." });
      }

      resp.status(200).json({ message: "Usuário excluído com sucesso." });
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      resp.status(500).json({ error: "Erro ao excluir usuário." });
    }
  }
}

export default UsuariosController;

