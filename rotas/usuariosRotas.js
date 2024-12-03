import express from 'express'; // Usando import para o express
import UsuarioControlador from '../controladores/usuariosControlador'; // Usando import para o controlador

const router = express.Router();

router.post('/login', UsuarioControlador.login); // Rota para login
router.get('/', UsuarioControlador.obterUsuario);
router.put('/saldo', UsuarioControlador.atualizarSaldo);
router.delete('/:id', UsuarioControlador.deletarUsuario);

export default router; // Usando export default para exportar o roteador


