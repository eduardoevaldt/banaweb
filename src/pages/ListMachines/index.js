import { useEffect, useState, useContext } from "react";
import Header from "../../components/Header";
import Title from "../../components/Title";

import { db } from "../../services/firebaseConnection";
import {
  BsPeopleFill,
  BsFillPencilFill,
  BsFillTrash3Fill,
  BsFillPersonPlusFill,
  BsSearch,
  BsFillGearFill,
  BsTrash3Fill,
  BsHammer,
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
  deleteDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import ModalMachines from "../../components/ModalMachines";
import ModalDeleteMachine from "../../components/ModalDeleteMachine";

const listRef = collection(db, "machines");

export default function ListMachines() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [lastDocs, setLastDocs] = useState();
  const [loadindMore, setLoadingMore] = useState(false);

  const [showPostModal, setShowPostModal] = useState(false);
  const [detail, setDetail] = useState();

  const [showPostModalDelete, setShowPostModalDelete] = useState(false);
  const [idDelete, setIdDelete] = useState();


  useEffect(() => {
    async function loadMachines() {
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

    loadMachines();

    return () => {};
  }, []);

  async function updateState(querySnapshot) {
    const isCollectionEmpty = querySnapshot.size === 0;

    if (!isCollectionEmpty) {
      let lista = [];

      querySnapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          categoria: doc.data().categoria,
          nome: doc.data().nome,
          marca: doc.data().marca,
          descricao: doc.data().descricao,
        });
      });

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1]; //Pegando o ultimo item da lista

      setMachines((machines) => [...machines, ...lista]);
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

  async function deleteMachine(id){
    const docRef = doc(db, "machines", id);

    await deleteDoc(docRef)
    .then(() => {
      window.location.reload();
    })
    .catch((error) => {
      toast.error("Ops, erro ao deletar essa máquina!");
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
          <Title name="Maquinaria">
            <BsHammer size={25} />
          </Title>

          <div className="container dashboard">
            <span>Buscando máquinas...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />

      <div className="content">
        <Title name="Maquinaria">
          <BsHammer size={25} />
        </Title>

        <>
          {machines.length === 0 ? (
            <div className="container dashboard">
              <span>Nenhuma máquina encontrada...</span>
              <Link to="/create-machines" className="new">
                + Adicionar
              </Link>
            </div>
          ) : (
            <>
              <Link to="/create-machines" className="new">
                + Adicionar
              </Link>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Categoria</th>
                    <th scope="col">Nome</th>
                    <th scope="col">Marca</th>
                    <th scope="col">Descrição</th>
                    <th scope="col">
                      <BsFillGearFill size={15} />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {machines.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td data-label="Categoria">{item.categoria}</td>
                        <td data-label="Nome">{item.nome}</td>
                        <td data-label="Marca">{item.marca}</td>
                        <td data-label="Descrição">{item.descricao}</td>
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
                            to={`/create-machines/${item.id}`}
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
                    );
                  })}
                </tbody>
              </table>
              
              { loadindMore && <h4 className="text-more">Buscando maquinaria...</h4>}
              {!loadindMore && !isEmpty && <button className="btn-more" onClick={handleMore}>Buscar +</button>}

            </>
          )}
        </>
      </div>
      {showPostModal && (
        <ModalMachines
          conteudo={detail}
          close={ () => setShowPostModal(!showPostModal)}
        />
      )}

      {showPostModalDelete && (
        <ModalDeleteMachine
          close={ () => setShowPostModalDelete(!showPostModalDelete)}
          redirect= { () => deleteMachine(idDelete)}
        />
      )}
    </div>
  );
}
