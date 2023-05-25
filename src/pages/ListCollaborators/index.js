import { useEffect, useState, useContext } from "react";
import Header from "../../components/Header";
import Title from "../../components/Title";
import "./listCollaborators.css";

import { db } from "../../services/firebaseConnection";
import { BsPeopleFill, BsFillPencilFill, BsFillTrash3Fill, BsFillPersonPlusFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import {AuthContext} from "../../contexts/auth"
import {
  collection,
  getDocs,
  getDoc,
  doc
} from "firebase/firestore";
import { toast } from "react-toastify";

const listRef = collection(db, "collaborators");

export default function ListCollaborators() {

  const { user } = useContext(AuthContext);
  
  const [loadCollaborators, setLoadCollaborators] = useState(true);
  const [collaborators, setCollaborators] = useState([]);

  useEffect(() => {
    async function loadCollaborators() {

      const querySnapshot = await getDocs(listRef)
      .then((snapshot) => {
        let lista = [];

        snapshot.forEach((doc) =>{
          lista.push({
            id: doc.id,
            nome: doc.data().nome,
            cpf: doc.data().cpf,
            funcao: doc.data().funcao,
            cbo: doc.data().cbo,
            telefone: doc.data().telefone,
            endereco: doc.data().endereco,
          })

          if(snapshot.docs.size === 0){
            setLoadCollaborators(false);
            return;
          }

          setCollaborators(lista);
          setLoadCollaborators(false);

        })
      })
      .catch((error) => {
        toast.error("Erro ao buscar funcionários")
        setLoadCollaborators(false);
      })
    }

    loadCollaborators();
  }, []);

  return (
    <div>
      <Header />

      <div className="content">
        <Title name="Funcionários">
          <BsPeopleFill size={25} />
        </Title>

        <div className="container">
          <Link to="/create-collaborators">
            <button className="add-button">
              <BsFillPersonPlusFill className="BsFillPersonPlusFill" size={30} />
            </button>
          </Link>
        </div>

        <div className="container">
          <div>
            <table className="table">
              <thead>
                <tr className="table-dark">
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>CBO</th>
                  <th>Função</th>
                  <th>Endereço</th>
                  <th>Telefone</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {collaborators.map((item) => (
                      <article key={item.id} className="list">
                        <p>{item.nome}</p>
                      </article>
                    ))}
                  </td>
                  <td>
                    {collaborators.map((item) => (
                      <article key={item.id} className="list">
                        <p>{item.cpf}</p>
                      </article>
                    ))}
                  </td>
                  <td>
                    {collaborators.map((item) => (
                      <article key={item.id} className="list">
                        <p>{item.cbo}</p>
                      </article>
                    ))}
                  </td>
                  <td>
                    {collaborators.map((item) => (
                      <article key={item.id} className="list">
                        <p>{item.funcao}</p>
                      </article>
                    ))}
                  </td>
                  <td>
                    {collaborators.map((item) => (
                      <article key={item.id} className="list">
                        <p>{item.endereco}</p>
                      </article>
                    ))}
                  </td>
                  <td>
                    {collaborators.map((item) => (
                      <article key={item.id} className="list">
                        <p>{item.telefone}</p>
                      </article>
                    ))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
