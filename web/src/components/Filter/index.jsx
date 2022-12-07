import React, { useEffect, useState } from "react";
import axios from "../../services/api";
import { getItem } from "../../utils/storage";
import "./styles.scss";

import Categoria from "../Categoria";

export default function Filter({
  setTransacoes,
  transacoes,
  setAtualizacao,
  atualizacao,
  categoriasAtivas,
  setCategoriasAtivas,
  filtroAplicado,
  setFiltroAplicado,
}) {
  const [categorias, setCategorias] = useState();

  async function handleListarCategorias() {
    const token = getItem("token");
    try {
      const { data } = await axios.get("/usuario/categoria", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategorias(data);
    } catch (error) {
      console.log(error.response.data.mensagem);
    }
  }

  function handleMiniCategorias(descricao) {
    let newCategoriasAtivas = categoriasAtivas;
    if (categoriasAtivas.includes(descricao)) {
      const index = categoriasAtivas.indexOf(descricao);
      newCategoriasAtivas.splice(index, 1);
    } else {
      newCategoriasAtivas = [...categoriasAtivas, descricao];
    }
    setCategoriasAtivas(newCategoriasAtivas);
  }

  function handleLimparFiltro() {
    setCategoriasAtivas([]);
    setFiltroAplicado(false);
    setAtualizacao(atualizacao + 1);
  }

  function handleAplicarFiltro() {
    setFiltroAplicado(true);
    setAtualizacao(atualizacao + 1);
    let transacoesFiltradas = [...transacoes];
    transacoesFiltradas = transacoesFiltradas.filter((filtro) => {
      return categoriasAtivas.includes(filtro.categoria_nome);
    });
    setTransacoes(transacoesFiltradas);
    if (categoriasAtivas.length === 0) setFiltroAplicado(false);
  }

  useEffect(() => {
    handleListarCategorias();
  }, [atualizacao]);

  return (
    <div className="container-filtro">
      <div className="wrap-categorias-botoes">
        <strong>Categoria</strong>
        <div className="container-categorias">
          {categorias &&
            categorias.map((categoria, index) => {
              return (
                <Categoria
                  descricao={categoria}
                  key={index}
                  handleMiniCategorias={handleMiniCategorias}
                  categoriasAtivas={categoriasAtivas}
                />
              );
            })}
        </div>
        <div className="container-botoes">
          <button onClick={handleLimparFiltro}>Limpar Filtros</button>
          <button
            className={filtroAplicado ? "botao-roxo" : ""}
            onClick={handleAplicarFiltro}
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
}
