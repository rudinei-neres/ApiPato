import express from 'express';
import cors from 'cors';
import usuariosRotas from './rotas/usuariosRotas.js'; // Certifique-se de que está importando corretamente
import errorHandler from './middlewares/errorHandler.js';
import autenticacaoMiddleware from './middlewares/autenticacaoMiddleware.js';

const app = express();
const PORTA = 5000;

app.use(cors());
app.use(express.json());

// Rotas abertas (sem autenticação)
app.use('/api/usuarios/login', usuariosRotas); // Exemplo de rota aberta para login
app.use('/api/usuarios/cadastro', usuariosRotas); // Exemplo de rota aberta para cadastro

// Middleware de autenticação
app.use(autenticacaoMiddleware); // Aplica o middleware de autenticação para todas as rotas abaixo





app.use(errorHandler);

app.listen(PORTA, () => {
  console.log(`Servidor rodando na porta ${PORTA}`);
});
