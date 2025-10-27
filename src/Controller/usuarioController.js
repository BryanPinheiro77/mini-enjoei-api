import express from 'express'
import { usuarioRepository as repo } from '../Repository/usuarioRepository.js'
import { generateToken } from '../Utils/jwt.js'

const endpoints = express.Router()

// CADASTRO DE USUÁRIO
endpoints.post('/usuario/registrar', async (req, resp) => {
  try {
    const { nome, email, senha } = req.body

    if (!nome || !email || !senha)
      return resp.status(400).send({ erro: 'Preencha todos os campos' })

    const id = await repo.cadastrarUsuario(nome, email, senha)
    resp.status(201).send({ id, nome, email })
  } catch (err) {
    resp.status(500).send({ erro: err.message })
  }
})

// LOGIN DE USUÁRIO
endpoints.post('/usuario/login', async (req, resp) => {
  try {
    const email = req.body.email
    const senha = req.body.senha

    const credenciais = await repo.validarCredenciais(email, senha)
    if (!credenciais) {
      resp.status(401).send({ erro: 'Email ou senha incorretos' })
    } else {
      const token = generateToken({
        id: credenciais.id_usuario,
        nome: credenciais.nome,
        email: credenciais.email
      })

      resp.send({ token })
    }
  } catch (err) {
    resp.status(500).send({ erro: err.message })
  }
})

export default endpoints;
