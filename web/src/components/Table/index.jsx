import Editar from "../../assets/editar.svg";
import Excluir from "../../assets/excluir.svg";
import axios from "../../services/api";
import { getItem } from "../../utils/storage";
import "./styles.scss";
import { useEffect, useState } from "react";
import setaFiltro from "../../assets/seta-filtro.svg";

export default function Table({
  setTransacoes,
  transacoes,
  transacaoAtual,
  setTransacaoAtual,
  atualizacao,
  setAtualizacao,
  setModalAberto,
  tipoOperacao,
  setTipoOperacao,
  filtroAparecendo,
}) {
  const cabecalhoTabela = [
    "Dia da semana",
    "Descrição",
    "Categoria",
    "Valor",
    " ",
  ];
  const diaDaSemana = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];
  const [ordenaData, setOrdenaData] = useState(false);

  function handleMiniModal(e, transacao) {
    setTransacaoAtual(transacao.id);
    setTipoOperacao("deletar");
    e.stopPropagation();
  }

  async function handleDeleteTransac() {
    const token = getItem("token");
    try {
      await axios.delete(`/transacao/${transacaoAtual}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAtualizacao(atualizacao + 1);
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleModalAberto = (e, transacao) => {
    setTransacaoAtual(transacao.id);
    setModalAberto(true);
    setTipoOperacao("editar");
    e.stopPropagation();
  };

  function handleOrdenaPorData() {
    let transacoesOrdenadas = transacoes;
    if (ordenaData) {
      transacoesOrdenadas = transacoesOrdenadas.sort((a, b) => {
        return new Date(a.data) - new Date(b.data);
      });
    } else {
      transacoesOrdenadas = transacoesOrdenadas.sort((a, b) => {
        return new Date(b.data) - new Date(a.data);
      });
    }
    setTransacoes(transacoesOrdenadas);
    setOrdenaData(!ordenaData);
  }

  useEffect(() => {}, [transacoes]);

  return (
    <div className="tabela">
      <div className="cabecalho-tabela">
        <div className="data-seta" onClick={handleOrdenaPorData}>
          <p>Data</p>
          <img
            className={ordenaData ? "" : "seta-invertida"}
            src={setaFiltro}
            alt="Seta para ordenação da lista"
          />
        </div>
        {cabecalhoTabela.map((item, index) => {
          return <p key={index}>{item}</p>;
        })}
      </div>
      <div
        className="corpo-tabela"
        style={filtroAparecendo ? { height: "400px" } : { height: "70vh" }}
      >
        {transacoes &&
          transacoes.map((transacao, index) => {
            return (
              <div className="linha-tabela" key={index}>
                <p>
                  {new Date(transacao.data).toLocaleString("pt-BR", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                  })}
                </p>
                <p>{diaDaSemana[new Date(transacao.data).getDay()]}</p>
                <p>{transacao.descricao}</p>
                <p>{transacao.categoria_nome}</p>
                <p
                  className={
                    transacao.tipo === "entrada"
                      ? "valor-entrada"
                      : "valor-saida"
                  }
                >
                  {(transacao.valor / 100).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
                <div className="editar-excluir">
                  <img
                    src={Editar}
                    alt="Ícone de editar."
                    onClick={(e) => handleModalAberto(e, transacao)}
                  />
                  <img
                    src={Excluir}
                    alt="Ícone de excluir."
                    onClick={(e) => handleMiniModal(e, transacao)}
                  />
                  <div
                    className={`miniModal ${
                      transacao.id === transacaoAtual &&
                      tipoOperacao !== "editar"
                        ? ""
                        : "escondido"
                    }`}
                  >
                    <p>Apagar item?</p>
                    <div className="apagar-transac">
                      <button onClick={handleDeleteTransac}>Sim</button>
                      <button>Não</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
