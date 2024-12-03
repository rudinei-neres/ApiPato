import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import ConexaoMySql from "../database/ConexaoMySql.js";

class ServicoUsuarios {
  constructor() {
    this.conexao = new ConexaoMySql();
  }

  // Listar usuários
  async listar(token) {
    try {
      const decoded = this.verificarToken(token);
      if (decoded.papel !== "admin") {
        throw new Error("Acesso negado.");
      }

      const conexao = await this.conexao.getConexao();
      const [usuarios] = await conexao.execute("SELECT id_usuario, email, papel FROM usuarios");
      return usuarios;
    } catch (error) {
      console.error("Erro ao listar usuários:", error.message);
      throw new Error("Erro ao listar usuários.");
    }
  }

  // Cadastrar um novo usuário
  async cadastrarUsuario(usuario, token) {
    try {
      const decoded = this.verificarToken(token);
      if (decoded.papel !== "admin") {
        throw new Error("Acesso negado.");
      }

      const conexao = await this.conexao.getConexao();
      const senhaHash = await bcryptjs.hash(usuario.senha, 10);
      await conexao.execute(
        "INSERT INTO usuarios (email, senha, papel) VALUES (?, ?, ?)",
        [usuario.email, senhaHash, usuario.papel || "usuario"]
      );

      return { message: "Usuário cadastrado com sucesso." };
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error.message);
      throw new Error("Erro ao cadastrar o usuário.");
    }
  }

  // Obter saldo de um usuário
  async obterSaldoUsuario(email, token) {
    try {
      const decoded = this.verificarToken(token);

      if (decoded.email !== email && decoded.papel !== "admin") {
        throw new Error("Acesso negado.");
      }

      const conexao = await this.conexao.getConexao();
      const [resultado] = await conexao.execute(
        "SELECT saldo FROM usuarios WHERE email = ?",
        [email]
      );

      if (!resultado.length) {
        throw new Error("Usuário não encontrado.");
      }

      return { saldo: resultado[0].saldo };
    } catch (error) {
      console.error("Erro ao obter saldo:", error.message);
      throw new Error("Erro ao obter saldo.");
    }
  }

  // Atualizar saldo de um usuário
  async atualizarSaldoUsuario(email, novoSaldo, token) {
    try {
      const decoded = this.verificarToken(token);

      if (decoded.email !== email && decoded.papel !== "admin") {
        throw new Error("Acesso negado.");
      }

      const conexao = await this.conexao.getConexao();
      const [resultado] = await conexao.execute(
        "UPDATE usuarios SET saldo = ? WHERE email = ?",
        [novoSaldo, email]
      );

      if (!resultado.affectedRows) {
        throw new Error("Usuário não encontrado.");
      }

      return { message: "Saldo atualizado com sucesso." };
    } catch (error) {
      console.error("Erro ao atualizar saldo:", error.message);
      throw new Error("Erro ao atualizar saldo.");
    }
  }

  // Deletar um usuário
  async deletarUsuario(email, token) {
    try {
      const decoded = this.verificarToken(token);

      if (decoded.papel !== "admin") {
        throw new Error("Acesso negado.");
      }

      const conexao = await this.conexao.getConexao();
      const [resultado] = await conexao.execute(
        "DELETE FROM usuarios WHERE email = ?",
        [email]
      );

      if (!resultado.affectedRows) {
        throw new Error("Usuário não encontrado.");
      }

      return { message: "Usuário deletado com sucesso." };
    } catch (error) {
      console.error("Erro ao deletar usuário:", error.message);
      throw new Error("Erro ao deletar o usuário.");
    }
  }

  // Verificar token JWT
  verificarToken(token) {
    if (!token) {
      throw new Error("Token não fornecido.");
    }
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error("Erro ao verificar token:", error.message);
      throw new Error("Token inválido ou expirado.");
    }
  }
  async login(req, resp) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return resp.status(400).json({ error: "Email e senha são obrigatórios." });
      }

      const conexao = await new ConexaoMySql().getConexao();
      const [resultado] = await conexao.execute(
        "SELECT * FROM usuarios WHERE email = ?",
        [email]
      );

      const usuario = resultado[0];
      if (!usuario) {
        return resp.status(401).json({ error: "Email ou senha incorretos." });
      }

      const senhaValida = await bcryptjs.compare(senha, usuario.senha);
      if (!senhaValida) {
        return resp.status(401).json({ error: "Email ou senha incorretos." });
      }

      const token = jwt.sign(
        { id_usuario: usuario.id_usuario, email: usuario.email },
        process.env.JWT_SECRET,
        { expiresIn: "8h" }
      );

      delete usuario.senha;

      resp.status(200).json({ usuario, token });
    } catch (error) {
      console.error("Erro ao realizar login:", error.message);
      resp.status(500).json({ error: "Erro interno do servidor." });
    }
  }
}

export default ServicoUsuarios;

