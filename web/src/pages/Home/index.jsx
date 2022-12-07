import React, { useEffect, useState } from "react";
import Filtro from "../../assets/filtro.svg";
import Filter from "../../components/Filter";
import Modal from "../../components/Modal";
import Resumo from "../../components/Resumo";
import Table from "../../components/Table";
import axios from "../../services/api";
import { getItem } from "../../utils/storage";
import "./styles.scss";

export default function Home() {
  const [transacoes, setTransacoes] = useState();
  const [transacaoAtual, setTransacaoAtual] = useState();
  const [modalAberto, setModalAberto] = useState(false);
  const [atualizacao, setAtualizacao] = useState(0);
  const [tipoOperacao, setTipoOperacao] = useState("");
  const [filtroAparecendo, setFiltroAparecendo] = useState(false);
  const [categoriasAtivas, setCategoriasAtivas] = useState([]);
  const [filtroAplicado, setFiltroAplicado] = useState(false);

  const handleListarTransacoes = async () => {
    try {
      const token = getItem("token");
      let parametros = "";
      parametros = categoriasAtivas.map((cat, index) => {
        if (index < categoriasAtivas.length - 1) {
          return parametros.concat(`filtro[]=${cat}&`);
        } else {
          return parametros.concat(`filtro[]=${cat}`);
        }
      });
      parametros = `?${parametros.join("")}`;
      let { data } = await axios.get(
        `/transacao${parametros ? parametros : ""}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      data = data.sort((a, b) => {
        return new Date(a.data) - new Date(b.data);
      });
      setTransacoes(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleListarTransacoes();
  }, [atualizacao]);
  return (
    <div className="container-home" onClick={() => setTransacaoAtual(0)}>
      <div className="tabela-resumo">
        <div className="wrap-filtro-tabela">
          <button
            className={`filtrar ${filtroAparecendo ? "aberto" : ""}`}
            onClick={() => setFiltroAparecendo(!filtroAparecendo)}
          >
            <img src={Filtro} alt="Ícone de filtro." />
            Filtrar
          </button>
          <div className={`wrap-filtro ${filtroAparecendo ? "" : "collapsed"}`}>
            <Filter
              filtroAparecendo={filtroAparecendo}
              setTransacoes={setTransacoes}
              transacoes={transacoes}
              setAtualizacao={setAtualizacao}
              atualizacao={atualizacao}
              categoriasAtivas={categoriasAtivas}
              setCategoriasAtivas={setCategoriasAtivas}
              filtroAplicado={filtroAplicado}
              setFiltroAplicado={setFiltroAplicado}
            />
          </div>
          <Table
            setTransacoes={setTransacoes}
            transacoes={transacoes}
            transacaoAtual={transacaoAtual}
            setTransacaoAtual={setTransacaoAtual}
            atualizacao={atualizacao}
            setModalAberto={setModalAberto}
            tipoOperacao={tipoOperacao}
            setTipoOperacao={setTipoOperacao}
            setAtualizacao={setAtualizacao}
            filtroAparecendo={filtroAparecendo}
          />
        </div>
        <Resumo
          atualizacao={atualizacao}
          setModalAberto={setModalAberto}
          setTipoOperacao={setTipoOperacao}
          categoriasAtivas={categoriasAtivas}
          
        />
      </div>
      {modalAberto && (
        <Modal
          onClose={() => setModalAberto(false)}
          atualizacao={atualizacao}
          setAtualizacao={setAtualizacao}
          tipoOperacao={tipoOperacao}
          transacaoAtual={transacaoAtual}
        />
      )}
    </div>
  );
}
