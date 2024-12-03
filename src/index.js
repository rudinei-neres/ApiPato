import cors from "cors";
import express from "express";
import jwt from "jsonwebtoken";
import UsuariosController from "./controllers/UsuariosController.js";
import AutenticacaoController from "./controllers/AutenticacaoController.js";

// Configuração da aplicação
const app = express();
app.use(express.json());

// Configuração de CORS
app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "x-usuario"]
}));

// Responde às requisições OPTIONS para CORS Preflight
app.options("*", cors());

// Instâncias dos controladores
const _usuariosController = new UsuariosController();
const _autenticacaoController = new AutenticacaoController();

// Rotas públicas
app.post('/login', _autenticacaoController.login);
app.post("/usuarios", _usuariosController.adicionar);

// Middleware para verificar autenticação
app.use((req, resp, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extrai o token do header

  if (!token) {
    return resp.status(401).send("Usuário não autorizado.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Valida o token
    req.usuario = decoded; // Armazena as informações do token no objeto `req`
    next(); // Permite o acesso à rota
  } catch (error) {
    console.error("Erro na validação do token:", error.message);
    resp.status(401).send("Token inválido ou expirado.");
  }
});

// Rotas privadas
app.get("/usuarios", _usuariosController.listar);
app.put("/usuarios", _usuariosController.atualizar);
app.delete("/usuarios/:id", _usuariosController.excluir);

// Inicializa o servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API está rodando na porta ${port}`);
});
