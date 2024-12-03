import express from 'express';
import usuariosController from '../controladores/comprasControlador.js';

const router = express.Router();

// Endpoint para registrar usuários
router.post('/', usuariosController.adicionar);

export default router;
