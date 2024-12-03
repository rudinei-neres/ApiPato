import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PWD,
  database: process.env.MYSQL_DB,
};

async function getConnection() {
  return await mysql.createConnection(dbConfig);
}

// Middleware para autenticação JWT
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token não fornecido." });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido." });
    req.user = user;
    next();
  });
}

// Registro de Usuário
app.post("/usuarios", async (req, res) => {
  const { nome, email, senha, telefone, carteira } = req.body;
  
  // Validação de campos obrigatórios
  if (!nome || !email || !senha) {
    return res.status(400).json({ error: "Nome, email e senha são obrigatórios." });
  }

  try {
    // Criação do hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10);
    const connection = await getConnection();

    // Inserção do usuário no banco de dados
    await connection.execute(
      "INSERT INTO usuarios (nome, email, senha, telefone, carteira) VALUES (?, ?, ?, ?, ?)",
      [nome, email, hashedPassword, telefone, carteira || 0]
    );

    res.status(201).json({ message: "Usuário registrado com sucesso." });

  } catch (error) {
    console.error("Erro ao registrar usuário:", error); // Adicione esta linha para inspecionar o erro

    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: "Este email já está cadastrado." });
    } else {
      res.status(500).json({ error: "Erro ao registrar usuário." });
    }
  }
});


// Login de Usuário
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ error: "Email e senha são obrigatórios." });

  try {
    const connection = await getConnection();
    const [rows] = await connection.execute("SELECT * FROM usuarios WHERE email = ?", [email]);
    const user = rows[0];

    if (user && await bcrypt.compare(senha, user.senha)) {
      const token = jwt.sign({ id_usuario: user.id_usuario, email: user.email, papel: user.papel }, process.env.JWT_SECRET, { expiresIn: "8h" });
      res.status(200).json({ token });
    } else {
      res.status(401).json({ error: "Credenciais inválidas." });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao realizar login." });
  }
});

// Listar Ofertas
app.get("/ofertas", async (req, res) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute("SELECT * FROM ofertas");
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar ofertas." });
  }
});

// Comprar uma Oferta
app.post("/comprar", authenticateToken, async (req, res) => {
  const { oferta_id } = req.body;
  if (!oferta_id) return res.status(400).json({ error: "ID da oferta é obrigatório." });

  try {
    const connection = await getConnection();
    await connection.execute("INSERT INTO compras (usuario_id, oferta_id) VALUES (?, ?)", [req.user.id_usuario, oferta_id]);
    res.status(201).json({ message: "Compra realizada com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao realizar compra." });
  }
});

// Inicializar o Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
