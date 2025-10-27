import { connection } from './connection.js';

export const propostaRepository = {
  criar(dados) {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO proposta (id_produto, id_comprador, valor_ofertado, mensagem) VALUES (?, ?, ?, ?)',
        [dados.id_produto, dados.id_comprador, dados.valor_ofertado, dados.mensagem],
        (err, result) => err ? reject(err) : resolve(result.insertId)
      );
    });
  },

  buscarPorId(id) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM proposta WHERE id_proposta=?', [id], (err, result) => err ? reject(err) : resolve(result[0]));
    });
  },

  atualizarStatus(id, status) {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE proposta SET status=? WHERE id_proposta=?', [status, id], (err, result) => err ? reject(err) : resolve(result));
    });
  },

  listarPorProdutoParaVendedor(id_produto, id_vendedor) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT p.*
        FROM proposta p
        JOIN produto pr ON pr.id_produto = p.id_produto
        WHERE p.id_produto = ?
          AND pr.id_vendedor = ?`;
      connection.query(sql, [id_produto, id_vendedor], (err, result) => err ? reject(err) : resolve(result));
    });
  }
};
