import express from 'express';
import OfertasControlador from '../controladores/ofertasControlador.js';
import autenticacaoMiddleware from '../middlewares/autenticacaoMiddleware.js'; // Certifique-se de que o caminho está correto

const ofertasRotas = express.Router();

// Aplicar o middleware de autenticação a todas as rotas de ofertas
ofertasRotas.use(autenticacaoMiddleware);

// Rota para listar todas as ofertas
ofertasRotas.get('/', OfertasControlador.listarOfertas);

// Rota para obter uma oferta específica por ID
ofertasRotas.get('/:id', OfertasControlador.obterOferta);

// Rota para criar uma nova oferta
ofertasRotas.post('/', OfertasControlador.criarOferta);

// Rota para atualizar uma oferta por ID
ofertasRotas.patch('/atualizar', OfertasControlador.atualizarOferta);

// Rota para deletar uma oferta por ID
ofertasRotas.delete('/:id', OfertasControlador.deletarOferta);

export default ofertasRotas;
