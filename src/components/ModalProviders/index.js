import { BsX } from "react-icons/bs";


export default function ModalProviders({ conteudo, close }) {
  return (
    <div className="modal">
      <div className="container">
        <button className="close" onClick={close}>
          <BsX size={25} color="#FFF" />
          Voltar
        </button>

        <main>
          <h2>Detalhes do Fornecedor</h2>

          <div className="row">
            <span>
              Nome: <i>{conteudo.nome}</i>
            </span>
          </div>

          <div className="row">
            <span>
              CPF: <i>{conteudo.cpf}</i>
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
              Inscrição Estadual: <i>{conteudo.inscricaoEstadual}</i>
            </span>
          </div>

          <div className="row">
            <span>
              Produto Vendido: <i>{conteudo.prodVendido}</i>
            </span>
          </div>

          <div className="row">
            <span>
              Inscrição Estadual: <i>{conteudo.inscricaoEstadual}</i>
            </span>
          </div>

          <div className="row">
            <span>
              Certificadora: <i>{conteudo.certificadora}</i>
            </span>
          </div>

          <div className="row">
            <span>
              Data Certificado: <i>{conteudo.dataCert}</i>
            </span>
          </div>

        </main>
      </div>
    </div>
  );
}
