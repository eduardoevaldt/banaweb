import { useContext, useEffect, useState } from "react";

import Header from "../../components/Header";
import Title from "../../components/Title";
import { Link, useNavigate } from "react-router-dom";
import "./dashboard.css";
import {
  BsCardText,
  BsSearch,
  BsFillPencilFill,
  BsFillGearFill,
  BsTrash3Fill
} from "react-icons/bs";

import {
  collection,
  getDocs,
  orderBy,
  limit,
  startAfter,
  query,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { format } from "date-fns";
import Modal from '../../components/Modal'
import { toast } from "react-toastify";
import { reload } from "firebase/auth";
import ModalDeleteService from "../../components/ModalDeleteService";

const listRef = collection(db, "services");

export default function Dashboard() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEmpty, setIsEmpty] = useState(false);
  const [lastDocs, setLastDocs] = useState();
  const [loadindMore, setLoadingMore] = useState(false);

  const [showPostModal, setShowPostModal] = useState(false);
  const [detail, setDetail] = useState();

  const [showPostModalDelete, setShowPostModalDelete] = useState(false);
  const [idDelete, setIdDelete] = useState();

  useEffect(() => {
    async function loadServices() {
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

    loadServices();

    return () => {};
  }, []);

  async function updateState(querySnapshot) {
    const isCollectionEmpty = querySnapshot.size === 0;

    if (!isCollectionEmpty) {
      let lista = [];

      querySnapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          collaborator: doc.data().collaborator,
          collaboratorId: doc.data().collaboratorId,
          machine: doc.data().machine,
          machineId: doc.data().machineId,
          setor: doc.data().setor,
          created: doc.data().created,
          createdFormat: format(doc.data().created.toDate(), "dd/MM/yyyy"),
          area: doc.data().area,
          andamento: doc.data().andamento,
          descricao: doc.data().descricao,
        });
      });

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1]; //Pegando o ultimo item da lista

      setServices((services) => [...services, ...lista]);
      setLastDocs(lastDoc);

    } else {
      setIsEmpty(true);
    }

    setLoadingMore(false);
  }

  async function handleMore() {
    setLoadingMore(true);

    const userDetail = localStorage.getItem("@banawebPRO");
    setUser(JSON.parse(userDetail));

    if (userDetail) {
      const data = JSON.parse(userDetail);

      const q = query(
        listRef,
        orderBy("created", "desc"),
        startAfter(lastDocs),
        limit(5),
        where("userId", "==", data?.uid)
      );
      const querySnapshot = await getDocs(q);
      await updateState(querySnapshot);
      
    }
  }

  function toggleModal(item){
    setShowPostModal(!showPostModal)
    setDetail(item)
  }

  function toggleModalDelete(id){
    setShowPostModalDelete(!showPostModalDelete)
    setIdDelete(id)
  }

  async function deleteService(id){
    const docRef = doc(db, "services", id);

    await deleteDoc(docRef)
    .then(() => {
      window.location.reload();
      toast.success("Serviço deletado com sucesso!");
    })
    .catch((error) => {
      toast.error("Ops, erro ao deletar esse serviço!");
      console.log(error);
    })
  }

  if (loading) {
    return (
      <div>
        <Header />
        <div className="content">
          <Title name="Serviços">
            <BsCardText size={24} />
          </Title>

          <div className="container dashboard">
            <span>Buscando serviços...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />

      <div className="content">
        <Title name="Serviços">
          <BsCardText size={24} />
        </Title>

        <>
          {services.length === 0 ? (
            <div className="container dashboard">
              <span>Nenhum serviço encontrado...</span>
              <Link to="/new" className="new">
                + Adicionar
              </Link>
            </div>
          ) : (
            <>
              <Link to="/new" className="new">
                + Adicionar
              </Link>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Funcionário</th>
                    <th scope="col">Maquinaria</th>
                    <th scope="col">Setor</th>
                    <th scope="col">Área</th>
                    <th scope="col">Andamento</th>
                    <th scope="col">Data</th>
                    <th scope="col">
                      <BsFillGearFill size={15} />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td data-label="Funcionário">{item.collaborator}</td>
                        <td data-label="Maquinario">{item.machine}</td>
                        <td data-label="Setor">{item.setor}</td>
                        <td data-label="Área">{item.area}</td>
                        <td data-label="Andamento">
                          <span
                            className="badge"
                            style={{
                              backgroundColor:
                                item.andamento === "Em andamento"
                                  ? "#999"
                                  : "#5cb85c",
                            }}
                          >
                            {item.andamento}
                          </span>
                        </td>
                        <td data-label="Data">{item.createdFormat}</td>
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
                            to={`/new/${item.id}`}
                            style={{ backgroundColor: "#e6e600" }}
                          >
                            <BsFillPencilFill color="#FFF" size={17} />
                          </Link>
                          <Link
                            id="refresh"
                            className="action"
                            onClick={ () => toggleModalDelete(item.id)} 
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

              {loadindMore && (
                <h4 className="text-more">Buscando mais serviços...</h4>
              )}
              {!loadindMore && !isEmpty && (
                <button className="btn-more" onClick={handleMore}>
                  Buscar +
                </button>
              )}
            </>
          )}
        </>
      </div>
        
      {showPostModal && (
        <Modal
          conteudo={detail}
          close={ () => setShowPostModal(!showPostModal)}
        />
      )}

      {showPostModalDelete && (
        <ModalDeleteService
          close={ () => setShowPostModalDelete(!showPostModalDelete)}
          redirect= { () => deleteService(idDelete)}
        />
      )}

    </div>
  );
}
