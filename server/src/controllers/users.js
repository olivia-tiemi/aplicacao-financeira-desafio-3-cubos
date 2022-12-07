const { verificarEmailCadastrado } = require("../utils/verificaDados");
const pool = require("../connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const senhaJWT = require("../senhaJWT");

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const senhaEncriptada = await bcrypt.hash(senha, 10);

    const query = `
    INSERT INTO usuarios (nome, email, senha)
    VALUES ($1, $2, $3) RETURNING *;
  `;

    const { rows } = await pool.query(query, [nome, email, senhaEncriptada]);

    const { senha: _, ...dadosUsuario } = rows[0];

    res.status(201).json(dadosUsuario);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const efetuarLogin = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const [_, rows] = await verificarEmailCadastrado(res, { email });
    const senhaCorreta = await bcrypt.compare(senha, rows[0].senha);

    if (!senhaCorreta)
      return res
        .status(400)
        .json({ mensagem: "Usuário e/ou senha inválido(s)" });

    const token = jwt.sign({ id: rows[0].id }, senhaJWT, {
      expiresIn: `${60 * 60}s`,
    });

    const { senha: __, ...dadosUsuario } = rows[0];

    return res.json({ usuario: dadosUsuario, token });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

module.exports = {
  cadastrarUsuario,
  efetuarLogin,
};
