import { connection } from './connection.js'

export const usuarioRepository = {
  cadastrarUsuario(nome, email, senha) {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO usuario (nome, email, senha) VALUES (?, ?, MD5(?))',
        [nome, email, senha],
        (err, result) => {
          if (err) reject(err)
          else resolve(result.insertId)
        }
      )
    })
  },

  validarCredenciais(email, senha) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT id_usuario, nome, email FROM usuario WHERE email = ? AND senha = MD5(?)',
        [email, senha],
        (err, result) => {
          if (err) reject(err)
          else resolve(result.length > 0 ? result[0] : null)
        }
      )
    })
  }
}
