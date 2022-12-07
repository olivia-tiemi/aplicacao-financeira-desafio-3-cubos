const pool = require("../connection");
const bcrypt = require("bcrypt");
const { somaValoresFiltrados } = require("../utils/verificaDados");

const detalharUsuarioLogado = (req, res) => {
  return res.status(200).json(req.usuario);
};

const extratoTransacaoLogado = async (req, res) => {
  const { filtro } = req.query;
  const { id } = req.usuario;
  const resposta = [];

  try {
    const query = `
      SELECT SUM(t.valor) AS valor, c.descricao AS descricao , t.tipo 
      FROM transacoes t LEFT JOIN categorias c ON c.id = t.categoria_id
      WHERE usuario_id = $1
      GROUP BY c.descricao, t.tipo;
    `;
    const { rows } = await pool.query(query, [id]);

    if (filtro) {
      for (let element of filtro) {
        for (let transacao of rows) {
          if (transacao.descricao === element) {
            resposta.push(transacao);
          }
        }
      }
      return res.json(somaValoresFiltrados(resposta));
    }

    return res.json(somaValoresFiltrados(rows));
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const detalharTransacaoLogado = async (req, res) => {
  const { id: transacao_id } = req.params;
  const { id: usuario_id } = req.usuario;

  const query = `
    SELECT t.id, t.tipo, COALESCE(t.descricao, 'Sem descrição') AS descricao, CAST(t.valor AS FLOAT), 
    t.data_transacao as data, t.usuario_id, t.categoria_id, c.descricao AS categoria_nome 
    FROM transacoes t 
    LEFT JOIN categorias c
    ON c.id = t.categoria_id 
    WHERE t.usuario_id = $1 AND t.id = $2;
  `;

  try {
    const { rows, rowCount } = await pool.query(query, [
      usuario_id,
      transacao_id,
    ]);
    if (rowCount <= 0)
      return res.status(400).json({ mensagem: "Transação não encontrada" });

    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const cadastrarTransacaoLogado = async (req, res) => {
  const { id: usuario_id } = req.usuario;
  const {
    descricao,
    valor,
    data: data_transacao,
    categoria_id,
    tipo,
  } = req.body;
  const { descricao: categoria_nome } = req.categoriaAtual;

  const query = `
    INSERT INTO transacoes (tipo, descricao, valor, data_transacao, usuario_id, categoria_id) 
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
  `;

  try {
    const { rows, rowCount } = await pool.query(query, [
      tipo,
      descricao,
      valor,
      data_transacao,
      usuario_id,
      categoria_id,
    ]);

    if (rowCount <= 0)
      return res.status(400).json({ mensagem: "Operação falhou!" });

    const resposta = {
      id: rows[0].id,
      tipo,
      descricao,
      valor: parseFloat(valor),
      data: data_transacao,
      usuario_id,
      categoria_id,
      categoria_nome,
    };

    return res.json({ ...resposta });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const atualizarUsuarioLogado = async (req, res) => {
  const { nome, email, senha } = req.body;
  const { id: usuario_id } = req.usuario;

  try {
    const senhaEncriptada = await bcrypt.hash(senha, 10);

    const query = `
      UPDATE usuarios SET
      nome = $1, email = $2, senha = $3
      WHERE id = $4 RETURNING *;
    `;

    await pool.query(query, [nome, email, senhaEncriptada, usuario_id]);

    res.status(204).send();
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const listarCategorias = async (req, res) => {
  try {
    const query = `
      SELECT * FROM categorias;
    `;
    const { rows } = await pool.query(query);

    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const listarTransacoesLogado = async (req, res) => {
  const { id: usuario_id } = req.usuario;
  const { filtro } = req.query;
  const resposta = [];

  try {
    const query = `
      SELECT t.id, t.tipo, t.descricao, CAST(t.valor AS FLOAT), t.data_transacao as data,
      t.usuario_id, t.categoria_id, c.descricao as categoria_nome
      FROM transacoes t LEFT JOIN categorias c 
      ON t.categoria_id = c.id WHERE t.usuario_id = $1;
    `;
    const { rows } = await pool.query(query, [usuario_id]);

    if (filtro) {
      for (let element of filtro) {
        for (let transacao of rows) {
          if (transacao.categoria_nome === element) {
            resposta.push(transacao);
          }
        }
      }
      return res.json(resposta);
    }

    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const atualizarTransacaoLogado = async (req, res) => {
  const { id: transacao_id } = req.params;
  const { descricao, valor, data, categoria_id, tipo } = req.body;

  try {
    const query = `
      UPDATE transacoes SET
      descricao = $1, valor = CAST($2 AS FLOAT), data_transacao = $3, 
      categoria_id = $4, tipo = $5
      WHERE id = $6 RETURNING *;
    `;

    await pool.query(query, [
      descricao,
      valor,
      data,
      categoria_id,
      tipo,
      transacao_id,
    ]);

    res.status(204).send();
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const deletarTransacaoLogado = async (req, res) => {
  const { id: transacao_id } = req.params;

  try {
    const query = `
      DELETE FROM transacoes WHERE id = $1
    `;

    await pool.query(query, [transacao_id]);

    res.status(204).send();
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const listarCategoriasUsuario = async (req, res) => {
  const { id: usuario_id } = req.usuario;
  const resposta = [];

  try {
    const query = ` 
      SELECT c.descricao AS descricao
      FROM transacoes t LEFT JOIN categorias c ON c.id = t.categoria_id
      WHERE usuario_id = $1
      GROUP BY c.descricao;
    `;
    const { rows, rowCount } = await pool.query(query, [usuario_id]);

    if (rowCount <= 0) return res.status(404).json({ mensagem: "Usuário sem transações cadastradas!" });

    rows.map(resp => {
      resposta.push(resp.descricao);
    })

    return res.json(resposta);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." })
  }
}

module.exports = {
  detalharUsuarioLogado,
  detalharTransacaoLogado,
  cadastrarTransacaoLogado,
  atualizarUsuarioLogado,
  listarCategorias,
  listarTransacoesLogado,
  atualizarTransacaoLogado,
  deletarTransacaoLogado,
  extratoTransacaoLogado,
  listarCategoriasUsuario
};
