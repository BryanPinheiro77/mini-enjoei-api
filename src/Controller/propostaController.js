import express from 'express'
import { propostaRepository as repo } from '../Repository/propostaRepository.js'
import { produtoRepository as produtoRepo } from '../Repository/produtoRepository.js'
import { getAuthentication } from '../Utils/jwt.js'

const endpoints = express.Router()

endpoints.post('/propostas', getAuthentication(), async (req, resp) => {
  try {
    const { id_produto, valor_ofertado, mensagem } = req.body
    const id_comprador = req.user.id

    const [produto] = await produtoRepo.buscarPorId(id_produto)
    if (!produto)
      return resp.status(404).send({ erro: 'Produto não encontrado' })
    if (produto.id_vendedor === id_comprador)
      return resp.status(403).send({ erro: 'Você não pode fazer proposta no seu próprio produto' })
    if (produto.status !== 'disponivel')
      return resp.status(400).send({ erro: 'Produto indisponível' })

    const id = await repo.criar({ id_produto, id_comprador, valor_ofertado, mensagem })
    resp.status(201).send({ id, id_produto, valor_ofertado })
  } catch (err) {
    resp.status(500).send({ erro: err.message })
  }
})

endpoints.put('/propostas/:id/aceitar', getAuthentication(), async (req, resp) => {
  try {
    const id_proposta = req.params.id
    const proposta = await repo.buscarPorId(id_proposta)
    if (!proposta)
      return resp.status(404).send({ erro: 'Proposta não encontrada' })

    const [produto] = await produtoRepo.buscarPorId(proposta.id_produto)
    if (!produto)
      return resp.status(404).send({ erro: 'Produto não encontrado' })
    if (produto.id_vendedor !== req.user.id)
      return resp.status(403).send({ erro: 'Você não pode aceitar esta proposta' })

    await repo.atualizarStatus(id_proposta, 'aceita')
    await produtoRepo.marcarIndisponivel(proposta.id_produto)

    resp.send({ mensagem: 'Proposta aceita e produto marcado como indisponível' })
  } catch (err) {
    resp.status(500).send({ erro: err.message })
  }
})

endpoints.put('/propostas/:id/recusar', getAuthentication(), async (req, resp) => {
  try {
    const id_proposta = req.params.id
    const proposta = await repo.buscarPorId(id_proposta)
    if (!proposta)
      return resp.status(404).send({ erro: 'Proposta não encontrada' })

    const [produto] = await produtoRepo.buscarPorId(proposta.id_produto)
    if (produto.id_vendedor !== req.user.id)
      return resp.status(403).send({ erro: 'Você não pode recusar esta proposta' })

    await repo.atualizarStatus(id_proposta, 'recusada')
    resp.send({ mensagem: 'Proposta recusada com sucesso' })
  } catch (err) {
    resp.status(500).send({ erro: err.message })
  }
})

endpoints.get('/produtos/:id/propostas', getAuthentication(), async (req, resp) => {
  try {
    const id_produto = req.params.id
    const [produto] = await produtoRepo.buscarPorId(id_produto)

    if (!produto)
      return resp.status(404).send({ erro: 'Produto não encontrado' })
    if (produto.id_vendedor !== req.user.id)
      return resp.status(403).send({ erro: 'Sem permissão para ver propostas deste produto' })

    const propostas = await repo.listarPorProdutoParaVendedor(id_produto, req.user.id)
    resp.send(propostas)
  } catch (err) {
    resp.status(500).send({ erro: err.message })
  }
})

export default endpoints;
