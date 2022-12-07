import "./styles.css";
import olhoAberto from "../../assets/olho-aberto.svg";
import olhoFechado from "../../assets/olho-fechado.svg";
import { useState } from "react";

export default function Input({ label, type, set, value }) {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [count, setCount] = useState(30);
  const handleMostrarSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };
  return (
    <div className="container-input">
      <label htmlFor={label}>{label}</label>
      <input
        type={
          label === "Senha" || label === "Confirmação de senha"
            ? mostrarSenha
              ? "text"
              : "password"
            : type
        }
        id={label}
        placeholder={label}
        autoComplete="off"
        onChange={(e) => {
          label === "Descrição" && setCount(30 - e.target.value.length);
          set(e.target.value);
        }}
        value={value}
        required
      />
      {label === "Descrição" ? (
        count < 0 ? (
          <p>Você inseriu mais caracteres que o permitido.</p>
        ) : (
          <p>Restam {count} caracteres.</p>
        )
      ) : null}
      {(label === "Senha" || label === "Confirmação de senha") && (
        <img
          src={mostrarSenha ? olhoAberto : olhoFechado}
          className={mostrarSenha ? "" : "olho-fechado"}
          onClick={handleMostrarSenha}
          alt="ícone que habilita visibilidade da senha."
        />
      )}
    </div>
  );
}
