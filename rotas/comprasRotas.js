import express from 'express';
import usuariosController from '../controladores/comprasControlador.js';

const router = express.Router();

// Endpoint para registrar usuários
router.post('/', usuariosController.adicionar);
router.get('/:id_usuario', comprasControlador.buscarCompras);

export default router;
