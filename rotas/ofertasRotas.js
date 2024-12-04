import express from 'express';
const ofertasRotas = express.Router();
import OfertasControlador from '../controladores/ofertasControlador.js';

// Defina suas rotas
router.get('/', OfertasControlador.listarOfertas);
router.get('/:id', OfertasControlador.obterOferta);

// Exporte o router com export default
export default ofertasRotas;
