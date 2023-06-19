
export default function ModalDeleteMachine({ close, redirect}) {
    return (
      <div className="modal">
        <div className="container">
          <main>
            <div className="row">
              <p>Deseja excluir a máquina? </p>
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
  