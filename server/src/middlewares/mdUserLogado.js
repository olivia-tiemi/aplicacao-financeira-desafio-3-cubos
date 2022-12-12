const {
  verificarDados,
  verificarEmailCadastrado,
} = require("../utils/verificaDados.js");
const knex = require("../connection");

const verificarTransacao = async (req, res, next) => {
  const { descricao, valor, data, categoria_id, tipo } = req.body;
  const arrayDeTipos = ["entrada", "saida"];

  if (
    !verificarDados(res, {
      descricao,
      valor,
      data,
      categoria_id,
      tipo,
    })
  )
    return;

  const tipoValido = arrayDeTipos.some((element) => {
    return element === tipo;
  });

  if (!tipoValido) {
    return res
      .status(400)
      .json({ mensagem: "O tipo de transação é inválida." });
  }

  try {
    const categoriaAtual = await knex("categorias").where("id", categoria_id);

    if (categoriaAtual.length <= 0)
      return res
        .status(404)
        .json({ mensagem: "A categoria escolhida é inválida." });

    req.categoriaAtual = categoriaAtual[0];
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }

  next();
};

const verificarAtualizacaoCadastro = async (req, res, next) => {
  const { nome, email, senha } = req.body;
  const { email: usuario_email } = req.usuario;

  if (
    !verificarDados(res, {
      nome: nome.trim(),
      email: email.trim(),
      senha: senha.trim(),
    })
  )
    return;

  const emailCadastrado = await verificarEmailCadastrado(res, { email });
  if (emailCadastrado.length > 0 && email !== usuario_email) {
    return res.status(400).json({ mensagem: "Email ou senha inválido(s)" });
  }

  next();
};

const verificarUsuarioTransacao = async (req, res, next) => {
  const { id: transacao_id } = req.params;
  const { id: usuario_id } = req.usuario;

  try {
    const transacao = await knex("transacoes")
      .where("id", transacao_id)
      .andWhere({ usuario_id });

    if (transacao.length <= 0)
      return res.status(404).json({ mensagem: "Transação não encontrada." });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }

  next();
};

module.exports = {
  verificarTransacao,
  verificarAtualizacaoCadastro,
  verificarUsuarioTransacao,
};
