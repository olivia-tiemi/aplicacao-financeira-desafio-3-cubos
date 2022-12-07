import { useEffect, useState } from "react";
import closeCategoriaModal from "../../assets/close-modal-categoria.svg";
import "./styles.scss";

export default function Categoria({
  descricao,
  handleMiniCategorias,
  categoriasAtivas,
}) {
  const [categoriaAplicada, setCategoriaAplicada] = useState(false);

  const handleClick = () => {
    setCategoriaAplicada(!categoriaAplicada);
    handleMiniCategorias(descricao);
  };

  useEffect(() => {
    if (categoriasAtivas.length === 0) {
      setCategoriaAplicada(false);
    }
  }, [categoriasAtivas]);

  return (
    <div
      onClick={handleClick}
      className={`miniContainer-categoria ${
        categoriaAplicada ? "categoria-aplicada" : ""
      }`}
    >
      <p>{descricao}</p>
      <img
        className={categoriaAplicada ? "" : "botao-mais"}
        src={closeCategoriaModal}
      />
    </div>
  );
}
