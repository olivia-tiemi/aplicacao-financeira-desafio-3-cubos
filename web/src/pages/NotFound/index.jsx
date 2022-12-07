import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import "./styles.scss";

const NotFound = () => {
  const navigate = useNavigate();
  const voltar = () => navigate(-1);
  return (
    <section className="container-erro">
      <div className="nao-encontrado">
        <h1>Não encontrado</h1>
        <br />
        <p>A página requisitada não foi encontrada.</p>
        <Button onClick={voltar} text="Voltar" />
      </div>
    </section>
  );
};

export default NotFound;
