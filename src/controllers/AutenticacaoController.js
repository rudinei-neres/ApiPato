import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import ConexaoMySql from "../database/ConexaoMySql.js";

class AutenticacaoController {
  async login(req, resp) {
    try {
      const {email, senha} = req.body;

      if (!email || !senha) {
        return resp.status(400).json({ error: "Email e senha são obrigatórios." });
      }

      const conexao = await new ConexaoMySql().getConexao();
      const [resultado] = await conexao.execute(
        "SELECT * FROM usuarios WHERE email = ?",
        [email]
      );

      const usuarioEncontrado = resultado[0];
      if (!usuarioEncontrado) {
        return resp.status(401).json({ error: "Email ou senha incorreta." });
      }

      if (process.env.NODE_ENV !== "production") {
        console.log("Senha fornecida:", senha);
        console.log("Hash armazenado no banco:", usuarioEncontrado.senha);
      }

      const senhaValida = await bcryptjs.compare(senha, usuarioEncontrado.senha);
      if (!senhaValida) {
        return resp.status(401).json({ error: "Email ou senha incorreta." });
      }

      delete usuarioEncontrado.senha;

      const token = jwt.sign(
        { id_usuario: usuarioEncontrado.id_usuario, email: usuarioEncontrado.email, papel: usuarioEncontrado.papel },
        process.env.JWT_SECRET,
        { expiresIn: "8h" }
      );

      return resp.status(200).json({ usuario: usuarioEncontrado, token });
    } catch (error) {
      console.error("Erro ao realizar login:", error);
      return resp.status(500).json({ error: "Erro interno do servidor." });
    }
  }

  async verificarUsuario(req, resp) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return resp.status(401).json({ error: "Token de autenticação não fornecido." });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return resp.status(200).json(decoded);
    } catch (error) {
      console.error("Erro ao verificar usuário:", error);
      return resp.status(401).json({ error: "Token inválido ou expirado." });
    }
  }

  async logout(req, resp) {
    try {
      // Logout em JWT é feito descartando o token no lado cliente
      return resp.status(200).json({ message: "Logout realizado com sucesso." });
    } catch (error) {
      console.error("Erro ao realizar logout:", error);
      return resp.status(500).json({ error: "Erro interno do servidor." });
    }
  }
}

export default AutenticacaoController;

