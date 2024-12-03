import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ConexaoMySql from './database/conexaoMySql.js';

// Rota de login do usuário
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "Email e senha são obrigatórios." });
  }

  try {
    const connection = await new ConexaoMySql().getConexao();
    const [resultado] = await connection.execute(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    if (!resultado.length) {
      return res.status(401).json({ error: "Credenciais incorretas" });
    }

    const usuario = resultado[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: "Credenciais incorretas" });
    }

    // Gera um token JWT para o usuário logado
    const token = jwt.sign(
      { id_usuario: usuario.id_usuario, email: usuario.email, papel: usuario.papel },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    // Retorna o token e as informações do usuário (exceto senha)
    res.status(200).json({
      usuario: {
        nome: usuario.nome,
        email: usuario.email,
        papel: usuario.papel,
      },
      token,
    });
  } catch (error) {
    console.error("Erro ao tentar realizar o login:", error);
    res.status(500).json({ error: "Erro ao tentar realizar o login." });
  }
});
