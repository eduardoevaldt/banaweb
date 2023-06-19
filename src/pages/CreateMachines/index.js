import { useContext, useState, useEffect } from "react";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { BsFillPencilFill, BsPlusCircle } from "react-icons/bs";
import { toast } from "react-toastify";

import { db } from "../../services/firebaseConnection";
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";

import {AuthContext} from '../../contexts/auth'
import { useNavigate, useParams } from "react-router-dom";

const listRef = collection(db, "machines");

export default function CreateMachines() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [machines, setMachines] = useState([]);
  const [loadMachine, setLoadMachine] = useState(true);
  const [machineSelected, setMachineSelected] = useState(0)
  
  const [categoria, setCategoria] = useState("Veiculo");
  const [nome, setNome] = useState("");
  const [marca, setMarca] = useState("");
  const [descricao, setDescricao] = useState("");
  const [idMachine, setIdMachine] = useState(false);


  useEffect(() => {

    async function loadMachines() {
      const querySnapshot = await getDocs(listRef)
        .then((snapshot) => {
          let lista = [];

          snapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              categoria: doc.data().categoria,
              nome: doc.data().nome,
              marca: doc.data().marca,
              descricao: doc.data().descricao,
            });
          });

          if (snapshot.docs.size === 0) {
            console.log("NENHUMA MÁQUINA ENCONTRADA");
            setMachines([{ id: "1", nome: "MÁQUINA X" }]);
            setLoadMachine(false);
            return;
          }

          setMachines(lista);
          setLoadMachine(false);

          if(id){
            loadIdMachines(lista);
          }

        })
        .catch((error) => {
          console.log("ERRO AO BUSCAR MAQUINARIA", error);
          setLoadMachine(false);
          setMachines([{ id: "1", nome: "MÁQUINA X" }]);
        });
    }

    loadMachines();

  }, [id]);

  async function loadIdMachines(lista){
    const docRef = doc(db, "machines", id);
    await getDoc(docRef)
    .then((snapshot) => {
      setCategoria(snapshot.data().categoria);
      setNome(snapshot.data().nome);
      setMarca(snapshot.data().marca);
      setDescricao(snapshot.data().descricao);

      let index = lista.findIndex(item => item.id === snapshot.data().id)
      setMachineSelected(index);
      setIdMachine(true);
    })
    .catch((error) => {
      console.log(error);
      setIdMachine(false);
    })
  }


  async function handleRegister(e) {
    e.preventDefault();

    if(id){
      //Atualizando máquina
      const docRef = doc(db, "machines", id)
      await updateDoc(docRef, {
        categoria: categoria,
        nome: nome,
        marca: marca,
        descricao: descricao,
        userId: user?.uid,
      })
      .then(() => {
        toast.info("Máquina atualizada com sucesso!");
        setMachineSelected(0);
        navigate('/list-machines');
      })
      .catch((error) => {
        toast.error("Ops, erro ao atualizar!");
        console.log(error);
      })
     
      return;
    }

    //Cadastrar máquina
    if (
      categoria !== "" &&
      nome !== "" &&
      marca !== "" &&
      descricao !== ""
    ) {
      await addDoc(collection(db, "machines"), {
        created: new Date(),
        categoria: categoria,
        nome: nome,
        marca: marca,
        descricao: descricao,
        userId: user?.uid,
      })
        .then(() => {
          setCategoria("");
          setNome("");
          setMarca("");
          setDescricao("");
          toast.success("Máquina cadastrada!");
        })
        .catch((error) => {
          console.log(error);
          toast.error("Erro ao fazer o cadastro.");
        });
    } else {
      toast.error("Preencha todos os campos!");
    }
  
  }

  function handleChangeSelectCategoria(e) {
    setCategoria(e.target.value);
  }

  return (
    <div>
      <Header />

      <div className="content">
        
        <Title name={id ? "Editando Máquina" : "Cadastrar Máquina"}>
          { id ?  <BsFillPencilFill size={22} /> : <BsPlusCircle size={24} />}
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleRegister}>
            <span>
              <strong>Categoria</strong>
            </span>
            <select value={categoria} onChange={handleChangeSelectCategoria}>
              <option value="Veículo">Veículo</option>
              <option value="Bomba">Bomba</option>
              <option value="Máquina">Máquina</option>
              <option value="Maquinário de Engate">Maquinário de Engate Hidráulico</option>
              <option value="Ferramentas Manuais">Ferramentas Manuais</option>
            </select>

            <span>
              <strong>Nome</strong>
            </span>
            <input
              type="text"
              placeholder="Informe o nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <span>
              <strong>Marca</strong>
            </span>
            <input
              type="text"
              placeholder="Informe a marca"
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
            />


            <span>
              <strong>Descrição</strong>
            </span>
            <textarea
              type="text"
              placeholder="Descreva a máquina"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />

            <button type="submit">{id ? "Atualizar" : "Cadastrar"}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
