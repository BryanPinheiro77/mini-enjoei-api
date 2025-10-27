import { connection } from '../Repository/connection';

export const categoriaRepository = {
  listar() {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM categoria', (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  criar(nome) {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO categoria (nome) VALUES (?)',
        [nome],
        (err, result) => {
          if (err) reject(err);
          else resolve(result.insertId);
        }
      );
    });
  }
};
