import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CloseButton from "../../assets/close.svg";
import setaSelect from "../../assets/seta-select.svg";
import axios from "../../services/api";
import { getItem } from "../../utils/storage";
import Button from "../Button";
import Input from "../Input";
import "./styles.scss";

export default function Modal({
  id = "close",
  onClose = () => {},
  atualizacao,
  setAtualizacao,
  tipoOperacao,
  transacaoAtual,
}) {
  const [categorias, setCategorias] = useState();
  const [botaoEntrada, setBotaoEntrada] = useState("azul");
  const [botaoSaida, setBotaoSaida] = useState("cinza");
  const [tipo, setTipo] = useState("entrada");
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState("");
  const [data, setData] = useState("");
  const [descricao, setDescricao] = useState("");
  const transacao = useRef(transacaoAtual);

  const handleOutsideClick = (e) => {
    if (e.target.id === id) onClose();
  };

  async function handleListarCategorias() {
    const token = getItem("token");
    try {
      const { data } = await axios.get("/categoria", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategorias(data);
    } catch (error) {
      toast.error(error.response.data.mensagem, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }

  const handleBotaoEntrada = () => {
    setBotaoEntrada("azul");
    setBotaoSaida("cinza");
    setTipo("entrada");
  };
  const handleBotaoSaida = () => {
    setBotaoEntrada("cinza");
    setBotaoSaida("vermelho");
    setTipo("saida");
  };

  const handleNovoRegistro = async (e) => {
    e.preventDefault();
    const token = getItem("token");
    try {
      await axios.post(
        "/transacao",
        {
          tipo,
          descricao,
          valor: valor * 100,
          data,
          categoria_id: categoria,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Nova transação registrada!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setDescricao("");
      setValor("");
      setData("");
      setCategoria("");
      setAtualizacao(atualizacao + 1);
    } catch (error) {
      if (descricao.length > 30) {
        toast.error("Não é permitida descrição com mais de 30 caracteres.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        toast.error(error.response.data.mensagem, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
  };

  const handleEditarRegistro = async (e) => {
    e.preventDefault();
    const token = getItem("token");
    try {
      await axios.put(
        `/transacao/${transacao.current}`,
        {
          tipo,
          descricao,
          valor: valor * 100,
          data,
          categoria_id: categoria,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Transação editada com sucesso!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setDescricao("");
      setValor("");
      setData("");
      setCategoria("");
      setAtualizacao(atualizacao + 1);
    } catch (error) {
      if (descricao.length > 30) {
        toast.error("Não é permitida descrição com mais de 30 caracteres.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        toast.error(error.response.data.mensagem, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
  };

  useEffect(() => {
    handleListarCategorias();
  }, []);

  return (
    <>
      <div id={id} className="modal" onClick={handleOutsideClick}>
        <div className="modal-container">
          <form
            onSubmit={
              tipoOperacao === "cadastrar"
                ? handleNovoRegistro
                : handleEditarRegistro
            }
          >
            <h1>
              {tipoOperacao === "cadastrar"
                ? "Adicionar Registro"
                : "Editar Registro"}
            </h1>
            <img
              src={CloseButton}
              className="close-btn"
              onClick={onClose}
              alt="Botão para fechar o modal."
            />
            <div className="entrada-saida">
              <button
                className={botaoEntrada}
                type="button"
                onClick={handleBotaoEntrada}
              >
                Entrada
              </button>
              <button
                className={botaoSaida}
                type="button"
                onClick={handleBotaoSaida}
              >
                Saída
              </button>
            </div>
            <Input label="Valor" type="number" value={valor} set={setValor} />
            <div className="seta-select">
              <label htmlFor="cadastro-transac">Categoria</label>
              <select
                id="cadastro-transac"
                onChange={(e) => setCategoria(e.target.value)}
                value={categoria}
              >
                <option value="">Selecione uma categoria</option>
                {categorias &&
                  categorias.map((categoria) => {
                    return (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.descricao}
                      </option>
                    );
                  })}
              </select>
              <img src={setaSelect} alt="Seta do select" />
            </div>
            <Input label="Data" type="date" value={data} set={setData} />
            <Input
              label="Descrição"
              type="text"
              value={descricao}
              set={setDescricao}
            />
            <Button text="Confirmar" />
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
