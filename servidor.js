import express from 'express'; // Importando express
import cors from 'cors'; // Importando cors
import usuariosRotas from './rotas/usuariosRotas.js'; // Importando as rotas de usuários
import ofertasRotas from './rotas/ofertasRotas.js'; // Importando as rotas de ofertas
import comprasRotas from './rotas/comprasRotas.js'; // Importando as rotas de compras
import errorHandler from './middlewares/errorHandler.js'; // Importando o middleware de erro
import autenticacaoMiddleware from './middlewares/autenticacaoMiddleware.js'; // Importando o middleware de autenticação

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
