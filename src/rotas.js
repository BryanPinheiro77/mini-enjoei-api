import express from 'express';
import usuarioController from './Controller/usuarioController.js';
import categoriaController from './Controller/produtoController.js';
import produtoController from './Controller/propostaController.js';
import propostaController from './Controller/categoriaController.js';

export function adicionarRotas(api) {
  api.use(usuarioController);
  api.use(categoriaController);
  api.use(produtoController);
  api.use(propostaController);
  api.use('/public/storage', express.static('public/storage'));
}
