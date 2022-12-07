import Button from "../../components/Button";
import Input from "../../components/Input";
import "./styles.scss";
import { useState } from "react";
import { setItem } from "../../utils/storage";
import { useNavigate } from "react-router-dom";
import axios from "../../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/login", {
        email,
        senha,
      });
      setItem("token", data.token);
      setEmail("");
      setSenha("");
      toast.success(`Olá, ${data.usuario.nome}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } catch (err) {
      toast.error(err.response.data.mensagem, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const handleCadastrado = () => {
    navigate("/cadastro");
  };

  return (
    <div className="container-login">
      <ToastContainer />
      <div className="container-l">
        <h1>
          Controle suas <strong>finanças</strong>, sem planilha chata.
        </h1>
        <p>
          Organizar as suas finanças nunca foi tão fácil, com o DINDIN, você tem
          tudo num único lugar e em um clique de distância.
        </p>
        <Button text="Cadastre-se" onClick={handleCadastrado} />
      </div>
      <div className="container-r">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <Input label="Email" type="email" value={email} set={setEmail} />
          <Input label="Senha" type="password" value={senha} set={setSenha} />
          <Button text="Entrar" />
        </form>
      </div>
    </div>
  );
}
