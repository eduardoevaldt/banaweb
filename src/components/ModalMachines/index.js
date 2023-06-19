import { BsX } from "react-icons/bs";


export default function ModalMachines({ conteudo, close }) {
  return (
    <div className="modal">
      <div className="container">
        <button className="close" onClick={close}>
          <BsX size={25} color="#FFF" />
          Voltar
        </button>

        <main>
          <h2>Detalhes da Máquina</h2>

          <div className="row">
            <span>
              Categoria: <i>{conteudo.categoria}</i>
            </span>
          </div>

          <div className="row">
            <span>
              Nome: <i>{conteudo.nome}</i>
            </span>
          </div>

          <div className="row">
            <span>
              Marca: <i>{conteudo.marca}</i>
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
