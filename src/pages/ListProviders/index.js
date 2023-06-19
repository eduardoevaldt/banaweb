import { useEffect, useState, useContext } from "react";
import Header from "../../components/Header";
import Title from "../../components/Title";

import { db } from "../../services/firebaseConnection";
import {
  BsPeopleFill,
  BsFillPencilFill,
  BsFillTrash3Fill,
  BsFillPersonPlusFill,
  BsFillGearFill,
  BsTrash3Fill,
  BsPersonLinesFill,
  BsSearch,
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
  deleteDoc,
  doc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import ModalProviders from "../../components/ModalProviders";
import ModalDeleteProvider from "../../components/ModalDeleteProvider";

const listRef = collection(db, "providers");

export default function ListProviders() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [lastDocs, setLastDocs] = useState();
  const [loadindMore, setLoadingMore] = useState(false);

  const [showPostModal, setShowPostModal] = useState(false);
  const [detail, setDetail] = useState();

  const [showPostModalDelete, setShowPostModalDelete] = useState(false);
  const [idDelete, setIdDelete] = useState();



  useEffect(() => {
    async function loadProviders() {
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

    loadProviders();

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
          endereco: doc.data().endereco,
          telefone: doc.data().telefone,
          inscricaoEstadual: doc.data().inscricaoEstadual,
          prodVendido: doc.data().prodVendido,
          certificadora: doc.data().certificadora,
          dataCert: doc.data().dataCert,
        });
      });

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1]; //Pegando o ultimo item da lista

      setProviders((providers) => [...providers, ...lista]);
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

  async function deleteProvider(id){
    const docRef = doc(db, "providers", id);

    await deleteDoc(docRef)
    .then(() => {
      window.location.reload();
    })
    .catch((error) => {
      toast.error("Ops, erro ao deletar esse fornecedor!");
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
          <Title name="Fornecedores">
            <BsPersonLinesFill size={25} />
          </Title>

          <div className="container dashboard">
            <span>Buscando fornecedores...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />

      <div className="content">
        <Title name="Fornecedores">
          <BsPersonLinesFill size={25} />
        </Title>

        <>
          {providers.length === 0 ? (
            <div className="container dashboard">
              <span>Nenhum fornecedor encontrado...</span>
              <Link to="/create-providers" className="new">
                + Adicionar
              </Link>
            </div>
          ) : (
            <>
              <Link to="/create-providers" className="new">
                + Adicionar
              </Link>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Nome</th>
                    <th scope="col">CPF</th>
                    <th scope="col">Produto Vendido</th>
                    <th scope="col">Data do Certificado</th>
                    <th scope="col">
                      <BsFillGearFill size={15} />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {providers.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td data-label="Nome">{item.nome}</td>
                        <td data-label="CPF">{item.cpf}</td>
                        <td data-label="Produto Vendido">{item.prodVendido}</td>
                        <td data-label="Data do Certificado">{item.dataCert}</td>
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
                            to={`/create-providers/${item.id}`}
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
              
              { loadindMore && <h4 className="text-more">Buscando mais fornecedores...</h4>}
              {!loadindMore && !isEmpty && <button className="btn-more" onClick={handleMore}>Buscar +</button>}

            </>
          )}
        </>
      </div>

      {showPostModal && (
        <ModalProviders
          conteudo={detail}
          close={ () => setShowPostModal(!showPostModal)}
        />
      )}

      {showPostModalDelete && (
        <ModalDeleteProvider
          close={ () => setShowPostModalDelete(!showPostModalDelete)}
          redirect= { () => deleteProvider(idDelete)}
        />
      )}

    </div>
  );
}
