import express from 'express';
import { getAuthentication } from '../Utils/jwt.js';

const router = express.Router();

// Simulação de categorias fixas (não vem do banco)
export const categorias = [
  'Eletrônicos',
  'Roupas',
  'Móveis',
  'Games',
  'Esporte',
  'Automotivo'
];

// Listar categorias fixas
router.get('/categorias', (req, res) => {
  res.json(categorias);
});

export default router;
