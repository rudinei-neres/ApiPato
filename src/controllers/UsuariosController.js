import bcrypt from "bcrypt";
import ConexaoMySql from "../database/ConexaoMySql.js";

class UsuariosController {
  // Adiciona um novo usuário com senha protegida por hashing
  async adicionar(req, resp) {
    try {
      const novoUsuario = req.body;

      if (!novoUsuario.nome || !novoUsuario.email || !novoUsuario.senha) {
        resp.status(400).send("Os campos nome, email e senha são obrigatórios.");
        return;
      }

      const conexao = await new ConexaoMySql().getConexao();

      // Verifica se o email já está cadastrado
      const comandoVerificaEmail = "SELECT id FROM usuarios WHERE email = ?";
      const [usuarioExistente] = await conexao.execute(comandoVerificaEmail, [
        novoUsuario.email,
      ]);

      if (usuarioExistente.length > 0) {
        resp.status(400).send("Email já cadastrado.");
        return;
      }

      // Hash da senha com bcrypt
      const senhaHashed = await bcrypt.hash(novoUsuario.senha, 10);

      const comandoSql =
        "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)";

      const [resultado] = await conexao.execute(comandoSql, [
        novoUsuario.nome,
        novoUsuario.email,
        senhaHashed,
      ]);

      resp.status(201).send({ id: resultado.insertId, ...novoUsuario });
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error);
      resp.status(500).send("Erro interno do servidor.");
    }
  }

  // Lista todos os usuários com suporte a filtro
  async listar(req, resp) {
    try {
      const filtro = req.query.filtro || "";
      const conexao = await new ConexaoMySql().getConexao();

      const comandoSql = "SELECT id, nome, email, foto FROM usuarios WHERE nome LIKE ?";
      const [resultado] = await conexao.execute(comandoSql, [`%${filtro}%`]);

      resp.send(resultado);
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      resp.status(500).send("Erro interno do servidor.");
    }
  }

  // Atualiza informações de um usuário
  async atualizar(req, resp) {
    try {
      const usuarioEditar = req.body;

      if (!usuarioEditar.id || !usuarioEditar.nome || !usuarioEditar.email) {
        resp.status(400).send("Os campos id, nome e email são obrigatórios.");
        return;
      }

      const conexao = await new ConexaoMySql().getConexao();
      const comandoSql =
        "UPDATE usuarios SET nome = ?, email = ?, foto = ? WHERE id = ?";

      const [resultado] = await conexao.execute(comandoSql, [
        usuarioEditar.nome,
        usuarioEditar.email,
        usuarioEditar.foto || null,
        usuarioEditar.id,
      ]);

      if (resultado.affectedRows === 0) {
        resp.status(404).send("Usuário não encontrado.");
        return;
      }

      resp.send({ id: usuarioEditar.id, ...usuarioEditar });
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      resp.status(500).send("Erro interno do servidor.");
    }
  }

  // Exclui um usuário pelo ID
  async excluir(req, resp) {
    try {
      const id = +req.params.id;

      if (!id) {
        resp.status(400).send("ID do usuário é obrigatório.");
        return;
      }

      const conexao = await new ConexaoMySql().getConexao();
      const comandoSql = "DELETE FROM usuarios WHERE id = ?";

      const [resultado] = await conexao.execute(comandoSql, [id]);

      if (resultado.affectedRows === 0) {
        resp.status(404).send("Usuário não encontrado.");
        return;
      }

      resp.send({ message: "Usuário excluído com sucesso." });
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      resp.status(500).send("Erro interno do servidor.");
    }
  }
}

export default UsuariosController;
