import { useContext } from "react";
import { AuthContext } from "../../contexts/auth";

import Header from "../../components/Header";
import Title from "../../components/Title";
import { BsFillCalendar2PlusFill, BsPlus, BsSearch, BsFillPencilFill } from "react-icons/bs";
import { Link } from "react-router-dom";

import "./dashboard.css";

export default function Dashboard() {
  const { logout } = useContext(AuthContext);

  async function handleLogout() {
    await logout();
  }

  return(
    <div>
      <Header/>

      <div className="content">
        <Title name="Tarefas">
          <BsFillCalendar2PlusFill size={22} />
        </Title>

        <>
          <Link to="/new" className="new">
            <BsPlus color="#FFF" size={25} />
            Adicionar
          </Link>  

          <table>
            <thead>
              <tr>
                <th scope="col">Funcionário </th>
                <th scope="col">Serviço</th>
                <th scope="col">Andamento</th>
                <th scope="col">Data</th>
                <th scope="col">#</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td data-label="Cliente">Mercado Esquina</td>
                <td data-label="Assunto">Suporte</td>
                <td data-label="Status">
                  <span className="badge" style={{ backgroundColor: '#999' }}>
                    Em aberto
                  </span>
                </td>
                <td data-label="Cadastrado">12/05/2023</td>
                <td data-label="#">
                  <button className="action" style={{ backgroundColor: '#3583f6' }}>
                    <BsSearch color='#FFF' size={17}/>
                  </button>
                  <button className="action" style={{ backgroundColor: '#f6a935' }}>
                    <BsFillPencilFill color='#FFF' size={17}/>
                  </button>
                </td>
              </tr>

              <tr>
                <td data-label="Cliente">Informatica TECH</td>
                <td data-label="Assunto">Suporte</td>
                <td data-label="Status">
                  <span className="badge" style={{ backgroundColor: '#999' }}>
                    Concluído
                  </span>
                </td>
                <td data-label="Cadastrado">12/05/2023</td>
                <td data-label="#">
                  <button className="action" style={{ backgroundColor: '#3583f6' }}>
                    <BsSearch color='#FFF' size={17}/>
                  </button>
                  <button className="action" style={{ backgroundColor: '#f6a935' }}>
                    <BsFillPencilFill color='#FFF' size={17}/>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </>

      </div>
    
    </div>
  )
}
