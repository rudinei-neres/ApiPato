import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import ConexaoMySql from "../database/ConexaoMySql.js";

class AutenticacaoController {
  // Realiza login e retorna um token JWT
  async login(req, resp) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        resp.status(400).send("Email e Senha são obrigatórios.");
        return;
      }

      const conexao = await new ConexaoMySql().getConexao();
      const comandoSql = "SELECT * FROM usuarios WHERE email = ?";
      const [resultado] = await conexao.execute(comandoSql, [email]);

      const usuarioEncontrado = resultado[0];

      if (!usuarioEncontrado) {
        resp.status(401).send("Email ou Senha incorreta.");
        return;
      }

      // Verifica a senha usando bcrypt
      const senhaValida = await bcryptjs.compare(senha, usuarioEncontrado.senha);
      if (!senhaValida) {
        resp.status(401).send("Email ou Senha incorreta.");
        return;
      }

      // Remove a senha do objeto antes de retornar
      delete usuarioEncontrado.senha;

      // Gera um token JWT
      const token = jwt.sign(
        { id: usuarioEncontrado.id, email: usuarioEncontrado.email, role: usuarioEncontrado.role },
        process.env.JWT_SECRET, // Chave secreta do JWT
        { expiresIn: "8h" } // Tempo de expiração do token
      );

      resp.send({ usuario: usuarioEncontrado, token });
    } catch (error) {
      console.error("Erro ao realizar login:", error);
      resp.status(500).send("Erro interno do servidor.");
    }
  }

  // Verifica o usuário autenticado com base no token JWT
  async verificarUsuario(req, resp) {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        resp.status(401).send("Token de autenticação não fornecido.");
        return;
      }

      // Verifica e decodifica o token JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      resp.send(decoded);
    } catch (error) {
      console.error("Erro ao verificar usuário:", error);
      resp.status(401).send("Token inválido ou expirado.");
    }
  }

  // Realiza logout invalidando o token (exemplo básico, pode ser ampliado com blacklists)
  async logout(req, resp) {
    try {
      // Em JWT puro, logout é responsabilidade do cliente ao descartar o token.
      // Blacklists de tokens podem ser implementadas se necessário.
      resp.send("Logout realizado com sucesso.");
    } catch (error) {
      console.error("Erro ao realizar logout:", error);
      resp.status(500).send("Erro interno do servidor.");
    }
  }
}

export default AutenticacaoController;
