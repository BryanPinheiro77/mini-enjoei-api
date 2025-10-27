import express from 'express'
import { produtoRepository as repo } from '../Repository/produtoRepository.js'
import { getAuthentication } from '../Utils/jwt.js'
import { upload } from '../Utils/upload.js'

const endpoints = express.Router()

endpoints.post('/produtos', getAuthentication(), upload.single('imagem'), async (req, resp) => {
  try {
    const { nome, descricao, preco, id_categoria } = req.body
    const imagem = req.file ? '/public/storage/' + req.file.filename : null

    const id = await repo.criar({
      nome,
      descricao,
      preco,
      id_categoria,
      imagem,
      id_vendedor: req.user.id
    })

    resp.status(201).send({ id, nome, imagem })
  } catch (err) {
    resp.status(500).send({ erro: err.message })
  }
})

endpoints.get('/produtos', async (req, resp) => {
  try {
    const itens = await repo.listar()
    resp.send(itens)
  } catch (err) {
    resp.status(500).send({ erro: err.message })
  }
})

endpoints.put('/produtos/:id', getAuthentication(), async (req, resp) => {
  try {
    const id = req.params.id
    const produto = await repo.buscarPorId(id)

    if (!produto.length)
      return resp.status(404).send({ erro: 'Produto não encontrado' })
    if (produto[0].id_vendedor !== req.user.id)
      return resp.status(403).send({ erro: 'Sem permissão' })

    await repo.atualizar(id, req.body)
    resp.send({ mensagem: 'Produto atualizado com sucesso' })
  } catch (err) {
    resp.status(500).send({ erro: err.message })
  }
})

endpoints.delete('/produtos/:id', getAuthentication(), async (req, resp) => {
  try {
    const id = req.params.id
    const produto = await repo.buscarPorId(id)

    if (!produto.length)
      return resp.status(404).send({ erro: 'Produto não encontrado' })
    if (produto[0].id_vendedor !== req.user.id)
      return resp.status(403).send({ erro: 'Sem permissão' })

    await repo.excluir(id)
    resp.send({ mensagem: 'Produto excluído com sucesso' })
  } catch (err) {
    resp.status(500).send({ erro: err.message })
  }
})

endpoints.get('/produtos-disponiveis', getAuthentication(), async (req, resp) => {
  try {
    const { nome, preco_min, preco_max } = req.query
    const filtros = {
      nome: nome?.trim() || null,
      precoMin: preco_min ? Number(preco_min) : null,
      precoMax: preco_max ? Number(preco_max) : null,
      excluirUsuarioId: req.user.id
    }

    const itens = await repo.listarDisponiveis(filtros)
    resp.send(itens)
  } catch (err) {
    resp.status(500).send({ erro: err.message })
  }
})

endpoints.get('/meus-produtos', getAuthentication(), async (req, resp) => {
  try {
    const itens = await repo.listarDoUsuario(req.user.id)
    resp.send(itens)
  } catch (err) {
    resp.status(500).send({ erro: err.message })
  }
})

export default endpoints;
