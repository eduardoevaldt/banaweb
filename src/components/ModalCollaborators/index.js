import { BsX } from "react-icons/bs";


export default function ModalCollaborators({ conteudo, close }) {
  return (
    <div className="modal">
      <div className="container">
        <button className="close" onClick={close}>
          <BsX size={25} color="#FFF" />
          Voltar
        </button>

        <main>
          <h2>Detalhes do Funcionário</h2>

          <div className="row">
            <span>
              Nome: <i>{conteudo.nome}</i>
            </span>
          </div>

          <div className="row">
            <span>
              Endereço: <i>{conteudo.endereco}</i>
            </span>
          </div>

          <div className="row">
            <span>
              Telefone: <i>{conteudo.telefone}</i>
            </span>
          </div>

          <div className="row">
            <span>
              CNPJ da Empresa: <i>{conteudo.cnpjEmpresa}</i>
            </span>
          </div>

          <div className="row">
            <span>
              CBO: <i>{conteudo.cbo}</i>
            </span>
            <span>
              Admissão: <i>{conteudo.admissao}</i>
            </span>
          </div>

        </main>
      </div>
    </div>
  );
}
