import { useEffect, useState, useContext } from "react";
import Header from "../../components/Header";
import Title from "../../components/Title";
import "./listCollaborators.css";

import { db } from "../../services/firebaseConnection";
import {
  BsPeopleFill,
  BsFillPencilFill,
  BsFillTrash3Fill,
  BsFillPersonPlusFill,
  BsSearch,
  BsFillGearFill,
  BsTrash3Fill,
} from "react-icons/bs";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  orderBy,
  limit,
  startAfter,
  query,
  where,
} from "firebase/firestore";
import { toast } from "react-toastify";

const listRef = collection(db, "collaborators");

export default function ListCollaborators() {
  const [user, setUser] = useState({});

  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [lastDocs, setLastDocs] = useState();
  const [loadindMore, setLoadingMore] = useState(false);


  useEffect(() => {
    async function loadCollaborators() {
      const userDetail = localStorage.getItem("@banawebPRO");
      setUser(JSON.parse(userDetail));

      if (userDetail) {
        const data = JSON.parse(userDetail);

        const q = query(
          listRef,
          orderBy("created", "desc"),
          limit(5),
          where("userId", "==", data?.uid)
        );

        const querySnapshot = await getDocs(q);
        await updateState(querySnapshot);

        setLoading(false);
      }
    }

    loadCollaborators();

    return () => {};
  }, []);

  async function updateState(querySnapshot) {
    const isCollectionEmpty = querySnapshot.size === 0;

    if (!isCollectionEmpty) {
      let lista = [];

      querySnapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          nome: doc.data().nome,
          cpf: doc.data().cpf,
          empresa: doc.data().empresa,
          cnpjEmpresa: doc.data().cnpjEmpresa,
          funcao: doc.data().funcao,
          cbo: doc.data().cbo,
          telefone: doc.data().telefone,
          endereco: doc.data().endereco,
        });
      });

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1]; //Pegando o ultimo item da lista

      setCollaborators((collaborators) => [...collaborators, ...lista]);
      setLastDocs(lastDoc);

    } else {
      setIsEmpty(true);
    }

    setLoadingMore(false);
  }

  async function handleMore(){
    setLoadingMore(true);

    const userDetail = localStorage.getItem("@banawebPRO")
    setUser(JSON.parse(userDetail))

    if(userDetail){
      const data = JSON.parse(userDetail);

      const q = query(listRef, orderBy("created", "desc"), startAfter(lastDocs), limit(5), where("userId", "==", data?.uid));
      const querySnapshot = await getDocs(q);
      await updateState(querySnapshot);
     
    }    

  }

  if (loading) {
    return (
      <div>
        <Header />
        <div className="content">
          <Title name="Funcionários">
            <BsPeopleFill size={25} />
          </Title>

          <div className="container dashboard">
            <span>Buscando funcionários...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />

      <div className="content">
        <Title name="Funcionários">
          <BsPeopleFill size={25} />
        </Title>

        <>
          {collaborators.length === 0 ? (
            <div className="container dashboard">
              <span>Nenhum funcionário encontrado...</span>
              <Link to="/create-collaborators" className="new">
                <BsFillPersonPlusFill color="#FFF" size={25} />
                Adicionar
              </Link>
            </div>
          ) : (
            <>
              <Link to="/create-collaborators" className="new">
                <BsFillPersonPlusFill color="#FFF" size={25} />
                Adicionar
              </Link>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Nome</th>
                    <th scope="col">CPF</th>
                    <th scope="col">Empresa</th>
                    <th scope="col">CBO</th>
                    <th scope="col">Função</th>
                    <th scope="col">Endereço</th>
                    <th scope="col">Telefone</th>
                    <th scope="col">
                      <BsFillGearFill size={15} />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {collaborators.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td data-label="Nome">{item.nome}</td>
                        <td data-label="CPF">{item.cpf}</td>
                        <td data-label="Empresa">{item.empresa}</td>
                        <td data-label="CBO">{item.cbo}</td>
                        <td data-label="Função">{item.funcao}</td>
                        <td data-label="Endereco">{item.endereco}</td>
                        <td data-label="Telefone">{item.telefone}</td>
                        <td data-label="#">
                          <Link
                            className="action"
                            to={`/create-collaborators/${item.id}`}
                            style={{ backgroundColor: "#e6e600" }}
                          >
                            <BsFillPencilFill color="#FFF" size={17} />
                          </Link>
                          <Link
                            className="action"
                            style={{ backgroundColor: "#ff0000" }}
                          >
                            <BsTrash3Fill color="#FFF" size={17} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              { loadindMore && <h4 className="text-more">Buscando mais funcionários...</h4>}
              {!loadindMore && !isEmpty && <button className="btn-more" onClick={handleMore}>Buscar +</button>}

            </>
          )}
        </>
      </div>
    </div>
  );
}
