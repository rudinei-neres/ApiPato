import express from 'express';
import comprasControlador from '../controladores/comprasControlador';


const comprasRotas = express.Router();

// Endpoint para registrar usuários
router.get('/', comprasControlador.listarCompras);
router.post('/', comprasControlador.registrarCompra);


export default comprasRotas;
