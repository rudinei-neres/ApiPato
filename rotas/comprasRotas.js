import express from 'express';
import comprasControlador from '../controladores/comprasControlador.js';

const comprasRotas = express.Router();

// Endpoint para listar compras
comprasRotas.get('/', comprasControlador.listarCompras);

// Endpoint para registrar uma nova compra
comprasRotas.post('/', comprasControlador.registrarCompra);

export default comprasRotas;
