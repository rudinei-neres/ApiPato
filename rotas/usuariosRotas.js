import express from 'express';
import UsuarioControlador from '../controladores/usuariosControlador.js';
import autenticacaoMiddleware from '../middlewares/autenticacaoMiddleware.js';

const router = express.Router();

// Rotas públicas
router.post('/cadastro', UsuarioControlador.cadastrarUsuario);
router.post('/login', UsuarioControlador.login);

// Aplicar middleware de autenticação nas rotas protegidas
router.use(autenticacaoMiddleware);

// Rotas protegidas
router.put('/atualizar', UsuarioControlador.atualizarUsuario);
router.get('/perfil', UsuarioControlador.buscarUsuarioLogado);

console.log('Rotas de usuários registradas.');
export default router;
