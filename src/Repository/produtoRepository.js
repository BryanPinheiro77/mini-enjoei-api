import { connection } from './connection.js';

export const produtoRepository = {
  criar(dados) {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO produto (nome, descricao, preco, status, imagem, id_categoria, id_vendedor) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          dados.nome,
          dados.descricao,
          dados.preco,
          dados.status || 'disponivel',
          dados.imagem,
          dados.id_categoria,
          dados.id_vendedor
        ],
        (err, result) => err ? reject(err) : resolve(result.insertId)
      );
    });
  },

  listar() {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM produto', (err, result) => err ? reject(err) : resolve(result));
    });
  },

  buscarPorId(id) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM produto WHERE id_produto = ?', [id], (err, result) => err ? reject(err) : resolve(result));
    });
  },

  atualizar(id, dados) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE produto SET nome=?, descricao=?, preco=?, id_categoria=? WHERE id_produto=?',
        [dados.nome, dados.descricao, dados.preco, dados.id_categoria, id],
        (err, result) => err ? reject(err) : resolve(result)
      );
    });
  },

  excluir(id) {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM produto WHERE id_produto=?', [id], (err, result) => err ? reject(err) : resolve(result));
    });
  },

  marcarIndisponivel(id_produto) {
    return new Promise((resolve, reject) => {
      connection.query(
        "UPDATE produto SET status='vendido' WHERE id_produto=?",
        [id_produto],
        (err, result) => err ? reject(err) : resolve(result)
      );
    });
  },

  listarDisponiveis({ nome, precoMin, precoMax, excluirUsuarioId }) {
    const params = [];
    let sql = "SELECT * FROM produto WHERE status='disponivel'";

    if (nome) { sql += " AND nome LIKE ?"; params.push(`%${nome}%`); }
    if (precoMin != null) { sql += " AND preco >= ?"; params.push(precoMin); }
    if (precoMax != null) { sql += " AND preco <= ?"; params.push(precoMax); }
    if (excluirUsuarioId) { sql += " AND id_vendedor <> ?"; params.push(excluirUsuarioId); }

    return new Promise((resolve, reject) => {
      connection.query(sql, params, (err, result) => err ? reject(err) : resolve(result));
    });
  },

  listarDoUsuario(id_vendedor) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM produto WHERE id_vendedor=?",
        [id_vendedor],
        (err, result) => err ? reject(err) : resolve(result)
      );
    });
  }
};
