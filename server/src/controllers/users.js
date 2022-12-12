const { verificarEmailCadastrado } = require("../utils/verificaDados");
const knex = require("../connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const senhaJWT = require("../senhaJWT");

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const senhaEncriptada = await bcrypt.hash(senha, 10);

    const usuario = await knex("usuarios")
      .insert({ nome, email, senha: senhaEncriptada })
      .returning("*");

    res.status(201).json(usuario[0]);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const efetuarLogin = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await verificarEmailCadastrado(res, { email });
    const senhaCorreta = await bcrypt.compare(senha, usuario[0].senha);

    if (!senhaCorreta)
      return res
        .status(400)
        .json({ mensagem: "Usuário e/ou senha inválido(s)" });

    const token = jwt.sign({ id: usuario[0].id }, senhaJWT, {
      expiresIn: `${60 * 60}s`,
    });

    const { senha: __, ...dadosUsuario } = usuario[0];

    return res.json({ usuario: dadosUsuario, token });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

module.exports = {
  cadastrarUsuario,
  efetuarLogin,
};
