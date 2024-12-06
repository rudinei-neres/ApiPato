import express from 'express';
import comprasControlador from '../controladores/comprasControlador.js';
import autenticacaoMiddleware from '../middlewares/autenticacaoMiddleware.js'; // Certifique-se de que o caminho está correto

const comprasRotas = express.Router();

// Aplicar o middleware de autenticação para todas as rotas de compras
comprasRotas.use(autenticacaoMiddleware);

// Endpoint para listar compras do usuário autenticado
comprasRotas.get('/', comprasControlador.buscarCompras);

// Endpoint para registrar uma nova compra
comprasRotas.post('/', comprasControlador.adicionarCompras);

// Endpoint para obter uma compra específica por ID
comprasRotas.get('/:id', comprasControlador.obterCompra);

// Endpoint para atualizar uma compra por ID
comprasRotas.put('/:id', comprasControlador.atualizarCompra);

// Endpoint para deletar uma compra por ID
comprasRotas.delete('/:id', comprasControlador.deletarCompra);

export default comprasRotas;

