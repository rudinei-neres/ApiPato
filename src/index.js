import cors from "cors";
import express from "express";
import UsuariosController from "./controllers/UsuariosController.js";
import AutenticacaoController from "./controllers/AutenticacaoController.js";

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

const _usuariosController = new UsuariosController();
const _autenticacaoController = new AutenticacaoController();

// Rotas públicas
app.post("/login", _autenticacaoController.login);
app.post("/usuarios", _usuariosController.adicionar);

// Middleware para verificar autenticação
app.use((req, resp, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    resp.status(401).send("Usuário não autorizado.");
    return;
  }
  // Validação de token pode ser incluída aqui
  next();
});

// Rotas privadas
app.get("/usuarios", _usuariosController.listar);
app.put("/usuarios", _usuariosController.atualizar);
app.delete("/usuarios/:id", _usuariosController.excluir);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API está rodando na porta ${port}`);
});
