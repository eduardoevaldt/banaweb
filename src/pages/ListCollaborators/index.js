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
import { Link, useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  orderBy,
  limit,
  startAfter,
  query,
  where,
  doc, 
  deleteDoc
} from "firebase/firestore";
import { toast } from "react-toastify";
import { Button } from "bootstrap";
import ModalCollaborators from "../../components/ModalCollaborators";
import ModalDeleteCollaborator from "../../components/ModalDeleteCollaborator";

const listRef = collection(db, "collaborators");

export default function ListCollaborators() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [lastDocs, setLastDocs] = useState();
  const [loadindMore, setLoadingMore] = useState(false);

  const [showPostModal, setShowPostModal] = useState(false);
  const [detail, setDetail] = useState();

  const [showPostModalDelete, setShowPostModalDelete] = useState(false);
  const [idDelete, setIdDelete] = useState();


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
          admissao: doc.data().admissao
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

  async function deleteCollaborator(id){
    const docRef = doc(db, "collaborators", id);

    await deleteDoc(docRef)
    .then(() => {
      window.location.reload();
    })
    .catch((error) => {
      toast.error("Ops, erro ao deletar esse funcionário!");
      console.log(error);
    })
  }

  function toggleModal(item){
    setShowPostModal(!showPostModal)
    setDetail(item)
  }

  function toggleModalDelete(id){
    setShowPostModalDelete(!showPostModalDelete)
    setIdDelete(id)
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
                + Adicionar
              </Link>
            </div>
          ) : (
            <>
              <Link to="/create-collaborators" className="new">
                + Adicionar
              </Link>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Nome</th>
                    <th scope="col">CPF</th>
                    <th scope="col">Empresa</th>
                    <th scope="col">Função</th>
                    <th scope="col">
                      <BsFillGearFill size={15} />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {collaborators.map((item, index) => (
                  
                      <tr key={index}>
                        <td data-label="Nome">{item.nome}</td>
                        <td data-label="CPF">{item.cpf}</td>
                        <td data-label="Empresa">{item.empresa}</td>
                        <td data-label="Função">{item.funcao}</td>
                        <td data-label="Ações">
                        <Link
                            onClick={ () => toggleModal(item)}
                            className="action"
                            style={{ backgroundColor: "#4db8ff" }}
                          >
                            <BsSearch color="#FFF" size={17} />
                          </Link>
                          <Link
                            className="action"
                            to={`/create-collaborators/${item.id}`}
                            style={{ backgroundColor: "#e6e600" }}
                          >
                            <BsFillPencilFill color="#FFF" size={17} />
                          </Link>
                          <Link
                            onClick={ () => toggleModalDelete(item.id)}
                            className="action"
                            style={{ backgroundColor: "#ff0000" }}
                          >
                            <BsTrash3Fill color="#FFF" size={17} />
                          </Link>
                        </td>
                      </tr>
                  ))}
                </tbody>
              </table>
              
              { loadindMore && <h4 className="text-more">Buscando mais funcionários...</h4>}
              {!loadindMore && !isEmpty && <button className="btn-more" onClick={handleMore}>Buscar +</button>}

            </>
          )}
        </>
      </div>
      {showPostModal && (
        <ModalCollaborators
          conteudo={detail}
          close={ () => setShowPostModal(!showPostModal)}
        />
      )}

      {showPostModalDelete && (
        <ModalDeleteCollaborator
          close={ () => setShowPostModalDelete(!showPostModalDelete)}
          redirect= { () => deleteCollaborator(idDelete)}
        />
      )}
    </div>
  );
}
