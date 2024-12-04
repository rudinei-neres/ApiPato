import express from 'express';
import cors from 'cors';
import usuariosRotas from './rotas/usuariosRotas.js'; // Certifique-se de que está importando corretamente
import errorHandler from './middlewares/errorHandler.js';
import autenticacaoMiddleware from './middlewares/autenticacaoMiddleware.js';

import dotenv from 'dotenv';

dotenv.config(); // Carrega as variáveis de ambiente


const app = express();
const PORTA = 5000;

app.use(cors({
  origin: '*', // Permite requisições de qualquer origem
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Rotas abertas (sem autenticação)
app.use('/api/usuarios', usuariosRotas); // Exemplo de rota aberta para login
app.use('/api/usuarios', usuariosRotas); // Certifique-se de que o caminho está correto


// Middleware de autenticação
app.use(autenticacaoMiddleware); // Aplica o middleware de autenticação para todas as rotas abaixo


app.use((req, res, next) => {
  console.log(`Rota acessada: ${req.path}, Método: ${req.method}`);
  next();
});

app.use((req, res, next) => {
  console.log(`Rota acessada: ${req.path}`);
  next();
});

app.use(errorHandler);

app.listen(PORTA, () => {
  console.log(`Servidor rodando na porta ${PORTA}`);
});
