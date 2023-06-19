import { BsX } from "react-icons/bs";
import "./modal.css";

export default function ModalServices({ conteudo, close }) {
  return (
    <div className="modal">
      <div className="container">
        <button className="close" onClick={close}>
          <BsX size={25} color="#FFF" />
          Voltar
        </button>

        <main>
          <h2>Detalhes do Serviço</h2>

          <div className="row">
            <span>
              Funcionário: <i>{conteudo.collaborator}</i>
            </span>
          </div>

          <div className="row">
            <span>
              Maquinario: <i>{conteudo.machine}</i>
            </span>
          </div>

          <div className="row">
            <span>
              Área: <i>{conteudo.area}</i>
            </span>
          </div>

          <div className="row">
            <span>
              Setor: <i>{conteudo.setor}</i>
            </span>
          </div>

          <div className="row">
            <span>
              Cadastrado em: <i>{conteudo.createdFormat}</i>
            </span>
          </div>

          <div className="row">
            <span>
              Andamento:
              <i
                className="status-badge"
                style={{
                  color: "#FFF",
                  backgroundColor:
                    conteudo.andamento === "Terminado" ? "#5cb85c" : "#999"
                }}
              >
                {conteudo.andamento}
              </i>
            </span>
          </div>

          {conteudo.descricao !== "" && (
            <>
              <h3>Descrição</h3>
              <p>{conteudo.descricao}</p>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
