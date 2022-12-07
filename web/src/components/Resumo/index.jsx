import "./styles.scss";
import React, { useState, useEffect } from "react";
import axios from "../../services/api";
import { getItem } from "../../utils/storage";
import Button from "../Button";

export default function Resumo({
  atualizacao,
  setModalAberto,
  setTipoOperacao,
  categoriasAtivas
}) {
  const [resumo, setResumo] = useState();

  async function handleResumo() {
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
      const { data } = await axios.get(`/transacao/extrato${parametros ? parametros : ""}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResumo(data);
    } catch (error) {}
  }

  const handleModalAberto = () => {
    setModalAberto(true);
    setTipoOperacao("cadastrar");
  };

  useEffect(() => {
    handleResumo();
  }, [atualizacao]);

  return (
    <div className="container-resumo">
      <div className="resumo">
        <h3>Resumo</h3>
        <div className="resumo-linha">
          <p>Entradas</p>
          {
            <p className="valor-entrada">
              {resumo &&
                (resumo.entrada / 100).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
            </p>
          }
        </div>
        <div className="resumo-linha">
          <p>Saídas</p>
          {
            <p className="valor-saida">
              {resumo &&
                (resumo.saida / 100).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
            </p>
          }
        </div>
        <hr className="divisor" />
        <div className="resumo-linha">
          <p>Saldo</p>
          {
            <p
              className={
                resumo && resumo.entrada - resumo.saida < 0
                  ? "valor-saida"
                  : "saldo-positivo"
              }
            >
              {resumo &&
                ((resumo.entrada - resumo.saida) / 100).toLocaleString(
                  "pt-BR",
                  {
                    style: "currency",
                    currency: "BRL",
                  }
                )}
            </p>
          }
        </div>
      </div>
      <Button text="Adicionar Registro" onClick={handleModalAberto} />
    </div>
  );
}
