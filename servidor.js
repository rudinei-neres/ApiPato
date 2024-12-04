import express from 'express';
import cors from 'cors';
import usuariosRotas from './rotas/usuariosRotas.js';
import comprasRotas from './rotas/comprasRotas.js';
import ofertasRotas from './rotas/ofertasRotas.js';
import errorHandler from './middlewares/errorHandler.js';
import autenticacaoMiddleware from './middlewares/autenticacaoMiddleware.js';

import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORTA = 5000;

app.use(cors({
  origin: '*', // Permite requisições de qualquer origem
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Rotas abertas (sem autenticação)
app.use('/api/usuarios', usuariosRotas);
app.use('/api/compras', comprasRotas);
app.use('/api/ofertas', ofertasRotas);

// Middleware de autenticação
app.use(autenticacaoMiddleware); // Aplica o middleware de autenticação para rotas protegidas

// Logs de requisições
app.use((req, res, next) => {
  console.log(`[LOG] Rota acessada: ${req.path}, Método: ${req.method}`);
  next();
});

// Middleware de tratamento de erros
app.use(errorHandler);

app.listen(PORTA, () => {
  console.log(`Servidor rodando na porta ${PORTA}`);
});
