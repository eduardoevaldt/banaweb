import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';

import Header from "../../components/Header";
import Title from "../../components/Title";
import { BsFillPencilFill, BsPlusCircle } from "react-icons/bs";
import { toast } from "react-toastify";

import { db } from "../../services/firebaseConnection";
import { collection, getDocs, getDoc, doc, addDoc, updateDoc } from "firebase/firestore";

import { AuthContext } from "../../contexts/auth";

const listRef = collection(db, "collaborators");

export default function CreateCollaborators() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [collaborators, setCollaborators] = useState([]);
  const [loadCollaborator, setLoadCollaborator] = useState(true);
  const [collaboratorSelected, setCollaboratorSelected] = useState(0)

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [cnpjEmpresa, setCnpjEmpresa] = useState("");
  const [funcao, setFuncao] = useState("");
  const [cbo, setCbo] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [idCollaborator, setIdCollaborator] = useState(false);


  useEffect(() => {

    async function loadCollaborators() {
      const querySnapshot = await getDocs(listRef)
        .then((snapshot) => {
          let lista = [];

          snapshot.forEach((doc) => {
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

          if (snapshot.docs.size === 0) {
            console.log("NENHUM FUNCIONÁRIO ENCONTRADO");
            setCollaborators([{ id: "1", nome: "FULANO" }]);
            setLoadCollaborator(false);
            return;
          }

          setCollaborators(lista);
          setLoadCollaborator(false);

          if(id){
            loadIdCollaborators(lista);
          }

        })
        .catch((error) => {
          console.log("ERRO AO BUSCAR OS FUNCIONÁRIOS", error);
          setLoadCollaborator(false);
          setCollaborators([{ id: "1", nome: "FULANO" }]);
        });
    }

    loadCollaborators();

  }, [id]);

  async function loadIdCollaborators(lista){
    const docRef = doc(db, "collaborators", id);
    await getDoc(docRef)
    .then((snapshot) => {
      setNome(snapshot.data().nome);
      setCpf(snapshot.data().cpf);
      setEmpresa(snapshot.data().empresa);
      setCnpjEmpresa(snapshot.data().cnpjEmpresa);
      setFuncao(snapshot.data().funcao);
      setCbo(snapshot.data().cbo);
      setTelefone(snapshot.data().telefone);
      setEndereco(snapshot.data().endereco);

      let index = lista.findIndex(item => item.id === snapshot.data().id)
      setCollaboratorSelected(index);
      setIdCollaborator(true);
    })
    .catch((error) => {
      console.log(error);
      setIdCollaborator(false);
    })
  }


  async function handleRegister(e) {
    e.preventDefault();

    if(id){
      //Atualizando funcionário
      const docRef = doc(db, "collaborators", id)
      await updateDoc(docRef, {
        nome: nome,
        cpf: cpf,
        empresa: empresa,
        cnpjEmpresa: cnpjEmpresa,
        funcao: funcao,
        cbo: cbo,
        telefone: telefone,
        endereco: endereco,
        userId: user?.uid,
      })
      .then(() => {
        toast.info("Funcionário atualizado com sucesso!");
        setCollaboratorSelected(0);
        navigate('/list-collaborators');
      })
      .catch((error) => {
        toast.error("Ops, erro ao atualizar esse funcionário!");
        console.log(error);
      })
     
      return;
    }

    //Cadastrar um funcionário
    if (
      nome !== "" &&
      cpf !== "" &&
      empresa !== "" &&
      cnpjEmpresa !== "" &&
      funcao !== "" &&
      cbo !== "" &&
      telefone !== "" &&
      endereco !== ""
    ) {
      await addDoc(collection(db, "collaborators"), {
        created: new Date(),
        nome: nome,
        cpf: cpf,
        empresa: empresa,
        cnpjEmpresa: cnpjEmpresa,
        funcao: funcao,
        cbo: cbo,
        telefone: telefone,
        endereco: endereco,
        userId: user?.uid,
      })
        .then(() => {
          setNome("");
          setCpf("");
          setEmpresa("");
          setCnpjEmpresa("");
          setFuncao("");
          setCbo("");
          setTelefone("");
          setEndereco("");
          toast.success("Funcionário cadastrado!");
        })
        .catch((error) => {
          console.log(error);
          toast.error("Erro ao fazer o cadastro.");
        });
    } else {
      toast.error("Preencha todos os campos!");
    }
  }

  return (
    <div>
      <Header />

      <div className="content">

      <Title name={id ? "Editando Funcionário" : "Cadastrar Funcionário"}>
          { id ?  <BsFillPencilFill size={22} /> : <BsPlusCircle size={24} />}
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleRegister}>
            <span>
              <strong>Nome</strong>
            </span>
            <input
              type="text"
              placeholder="Informe o nome do funcionário"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <span>
              <strong>CPF</strong>
            </span>
            <input
              type="text"
              placeholder="Informe o CPF"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
            />

            <span>
              <strong>Empresa</strong>
            </span>
            <input
              type="text"
              placeholder="Informe o nome da empresa"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
            />

            <span>
              <strong>CNPJ</strong>
            </span>
            <input
              type="text"
              placeholder="Informe o CNPJ da empresa"
              value={cnpjEmpresa}
              onChange={(e) => setCnpjEmpresa(e.target.value)}
            />

            <span>
              <strong>Função</strong>
            </span>
            <input
              type="text"
              placeholder="Informe a funcão"
              value={funcao}
              onChange={(e) => setFuncao(e.target.value)}
            />

            <span>
              <strong>CBO</strong>
            </span>
            <input
              type="text"
              placeholder="Informe o número CBO"
              value={cbo}
              onChange={(e) => setCbo(e.target.value)}
            />

            <span>
              <strong>Telefone</strong>
            </span>
            <input
              type="text"
              placeholder="Informe o telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />

            <span>
              <strong>Endereço</strong>
            </span>
            <input
              type="text"
              placeholder="Informe o endereço"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
            />

            <button type="submit">{id ? "Atualizar" : "Cadastrar"}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
