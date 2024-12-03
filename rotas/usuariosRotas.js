const express = require('express');
const router = express.Router();
const UsuarioControlador = require('../controladores/usuariosControlador');

router.post('/login', UsuarioControlador.login); // Rota para login
router.get('/', UsuarioControlador.obterUsuario);
router.put('/saldo', UsuarioControlador.atualizarSaldo);
router.delete('/:id', UsuarioControlador.deletarUsuario);

module.exports = router;

