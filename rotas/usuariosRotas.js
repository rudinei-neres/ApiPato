import express from 'express';
import UsuarioControlador from '../controladores/usuariosControlador.js'; // Certifique-se de que este caminho e a exportação estão corretos

const router = express.Router();


router.post('/cadastro', UsuarioControlador.cadastrarUsuario);
router.post('/login', UsuarioControlador.login);// Certifique-se de que as funções no controlador estão corretas


router.put('/atualizar', UsuarioControlador.atualizarUsuario);
router.get('/perfil', UsuarioControlador.buscarUsuarioLogado); // Ajuste conforme o método do controlador



console.log('Rotas de usuários registradas.');
export default router; 
