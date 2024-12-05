import express from 'express';
import OfertasControlador from '../controladores/ofertasControlador.js';

const ofertasRotas = express.Router();

// Rota para listar todas as ofertas
ofertasRotas.get('/', OfertasControlador.listarOfertas);

// Rota para obter uma oferta específica por ID
ofertasRotas.get('/:id', OfertasControlador.obterOferta);

// Rota para criar uma nova oferta
ofertasRotas.post('/', OfertasControlador.criarOferta);

// Rota para deletar uma oferta por ID
ofertasRotas.delete('/:id', OfertasControlador.deletarOferta);

export default ofertasRotas;
