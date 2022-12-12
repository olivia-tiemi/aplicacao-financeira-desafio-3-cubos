const jwt = require("jsonwebtoken");
const senhaJwt = require("../senhaJWT");
const {
  verificarDados,
  verificarEmailCadastrado,
} = require("../utils/verificaDados.js");
const knex = require("../connection");

const verificarDadosCadastro = async (req, res, next) => {
  const { nome, email, senha } = req.body;

  if (
    !verificarDados(res, {
      nome: nome.trim(),
      email: email.trim(),
      senha: senha.trim(),
    })
  )
    return;

  const emailCadastrado = await verificarEmailCadastrado(res, { email });
  if (emailCadastrado.length > 0) {
    return res.status(400).json({ mensagem: "Email ou senha inválido(s)" });
  }

  next();
};

const verificarDadosLogin = async (req, res, next) => {
  const { email, senha } = req.body;

  if (!verificarDados(res, { email, senha })) return;

  const emailCadastrado = await verificarEmailCadastrado(res, { email });
  if (emailCadastrado.length <= 0) {
    return res.status(400).json({ mensagem: "Email ou senha inválido(s)" });
  }

  next();
};

const verificarLogin = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization)
    return res.status(401).json({ mensagem: "Não autorizado." });
  const token = authorization.split(" ")[1];
  try {
    const { id } = jwt.verify(token, senhaJwt);
    const usuario = await knex("usuarios").where({ id });

    if (usuario.length <= 0)
      return res.status(403).json({ mensagem: "Não autorizado" });
    const { senha: _, ...dadosUsuario } = usuario[0];

    req.usuario = dadosUsuario;
    next();
  } catch (error) {
    return res.status(401).json({
      mensagem: "Ops, sua sessão expirou!",
    });
  }
};

module.exports = {
  verificarDadosCadastro,
  verificarDadosLogin,
  verificarLogin,
};
