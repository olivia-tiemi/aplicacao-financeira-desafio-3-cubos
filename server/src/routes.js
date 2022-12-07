const express = require("express");
const rota = express();
const {
  verificarDadosCadastro,
  verificarDadosLogin,
  verificarLogin,
} = require("./middlewares/mdUsers");
const { cadastrarUsuario, efetuarLogin } = require("./controllers/users");
const {
  detalharUsuarioLogado,
  detalharTransacaoLogado,
  cadastrarTransacaoLogado,
  atualizarUsuarioLogado,
  listarCategorias,
  listarTransacoesLogado,
  atualizarTransacaoLogado,
  deletarTransacaoLogado,
  extratoTransacaoLogado,
  listarCategoriasUsuario,
} = require("./controllers/userLogado");
const {
  verificarTransacao,
  verificarAtualizacaoCadastro,
  verificarUsuarioTransacao,
} = require("./middlewares/mdUserLogado");

rota.post("/usuario", verificarDadosCadastro, cadastrarUsuario);
rota.post("/login", verificarDadosLogin, efetuarLogin);

rota.use(verificarLogin);

rota.get("/usuario", detalharUsuarioLogado);
rota.get("/transacao/extrato", extratoTransacaoLogado);
rota.get("/transacao/:id", detalharTransacaoLogado);
rota.post("/transacao", verificarTransacao, cadastrarTransacaoLogado);
rota.put("/usuario", verificarAtualizacaoCadastro, atualizarUsuarioLogado);
rota.get("/categoria", listarCategorias);
rota.get("/transacao", listarTransacoesLogado);
rota.put(
  "/transacao/:id",
  verificarTransacao,
  verificarUsuarioTransacao,
  atualizarTransacaoLogado
);
rota.delete(
  "/transacao/:id",
  verificarUsuarioTransacao,
  deletarTransacaoLogado
);

rota.get("/usuario/categoria", listarCategoriasUsuario);

module.exports = rota;
