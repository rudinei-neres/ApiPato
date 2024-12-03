
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import usuariosRoutes from './routes/usuarios.js';
import { login } from './controllers/autenticacaoController.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Rotas de Usuários

app.post("/login", login);
app.use('/usuarios', usuariosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
