import express from 'express';
import UsuarioControlador from '../controladores/usuariosControlador.js'; // Certifique-se de que este caminho e a exportação estão corretos

const router = express.Router();

// Certifique-se de que as funções no controlador estão corretas
router.post('/login', UsuarioControlador.login); // Rota para login
router.get('/', UsuarioControlador.obterUsuario); // Supondo que obterUsuario seja uma função definida no controlador
router.put('/saldo', UsuarioControlador.atualizarSaldo); // Atualizar saldo
router.delete('/:id', UsuarioControlador.deletarUsuario); // Deletar usuário
router.post('/cadastro', UsuarioControlador.cadastrarUsuario);

export default router; // Exportando o router com export default
