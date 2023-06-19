
export default function ModalDeleteService({ close, redirect}) {
    return (
      <div className="modal">
        <div className="container">
          <main>
            <div className="row">
              <p>Deseja excluir o serviço? </p>
              <button className="redirect" onClick={redirect}>
                Sim
              </button>
              <button className="redirect-no" onClick={close}>
                Não
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }
  