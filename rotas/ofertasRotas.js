import express from 'express';
const router = express.Router();

// Defina suas rotas
router.get('/', (req, res) => {
  res.send('Lista de ofertas');
});

// Exporte o router com export default
export default router;
