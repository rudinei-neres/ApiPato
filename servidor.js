const express = require('express');
const cors = require('cors');
const usuariosRotas = require('./rotas/usuariosRotas');
const ofertasRotas = require('./rotas/ofertasRotas');
const comprasRotas = require('./rotas/comprasRotas');
const errorHandler = require('./middlewares/errorHandler');
const autenticacaoMiddleware = require('./middlewares/autenticacaoMiddleware');

const app = express();
const PORTA = 5000;

app.use(cors());
app.use(express.json());

// Rotas abertas (sem autenticação)
app.use('/api/usuarios/login', usuariosRotas); // Exemplo de rota aberta para login
app.use('/api/usuarios/cadastro', usuariosRotas); // Exemplo de rota aberta para cadastro

// Middleware de autenticação
app.use(autenticacaoMiddleware); // Aplica o middleware de autenticação para todas as rotas abaixo

// Rotas protegidas (autenticadas)
app.use('/api/usuarios', usuariosRotas);
app.use('/api/ofertas', ofertasRotas);
app.use('/api/compras', comprasRotas);

// Middleware de Tratamento de Erros
app.use(errorHandler);

app.listen(PORTA, () => {
  console.log(`Servidor rodando na porta ${PORTA}`);
});