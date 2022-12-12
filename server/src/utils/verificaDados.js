const knex = require("../connection");

function verificarDados(res, objeto) {
  for (let chave in objeto) {
    if (!objeto[chave]) {
      res.status(400).json({ mensagem: `O campo '${chave}' é obrigatório!` });
      return false;
    }
  }
  return true;
}

async function verificarEmailCadastrado(res, { email }) {
  try {
    const usuario = await knex("usuarios").where({ email });
    return usuario;
  } catch (error) {
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
}

function somaValoresFiltrados(transacoes) {
  const extrato = { entrada: 0, saida: 0 };
  transacoes.map((op) => {
    if (op.tipo === "entrada") {
      extrato.entrada += parseFloat(op.valor);
    } else if (op.tipo === "saida") {
      extrato.saida += parseFloat(op.valor);
    }
  });
  return extrato;
}

module.exports = {
  verificarDados,
  verificarEmailCadastrado,
  somaValoresFiltrados,
};
