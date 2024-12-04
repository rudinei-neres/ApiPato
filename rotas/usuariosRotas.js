import express from 'express';
import UsuarioControlador from '../controladores/usuariosControlador.js'; // Certifique-se de que este caminho e a exportação estão corretos

const router = express.Router();


router.post('/cadastro', UsuarioControlador.cadastrarUsuario);
router.post('/login', UsuarioControlador.login);// Certifique-se de que as funções no controlador estão corretas


router.put('/atualizar', UsuarioControlador.atualizarUsuario);


router.get('/', UsuarioControlador.obterUsuario); // Supondo que obterUsuario seja uma função definida no controlador
router.put('/saldo', UsuarioControlador.atualizarSaldo); // Atualizar saldo
router.delete('/:id', UsuarioControlador.deletarUsuario); // Deletar usuário

console.log('Rotas de usuários registradas.');
export default router; 
