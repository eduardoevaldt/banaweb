import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';

import Header from "../../components/Header";
import Title from "../../components/Title";
import { BsFillPencilFill, BsPlusCircle } from "react-icons/bs";
import { toast } from "react-toastify";

import { db } from "../../services/firebaseConnection";
import { collection, getDocs, getDoc, doc, addDoc, updateDoc } from "firebase/firestore";

import { AuthContext } from "../../contexts/auth";

const listRef = collection(db, "providers");

export default function CreateProviders() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [providers, setProviders] = useState([]);
  const [loadProvider, setLoadProvider] = useState(true);
  const [providerSelected, setProviderSelected] = useState(0)

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [inscricaoEstadual, setInscricaoEstadual] = useState("");
  const [prodVendido, setProdVendido] = useState("");
  const [certificadora, setCertificadora] = useState("");
  const [dataCert, setDataCert] = useState("");
  const [idProvider, setIdProvider] = useState(false);


  useEffect(() => {

    async function loadProviders() {
      const querySnapshot = await getDocs(listRef)
        .then((snapshot) => {
          let lista = [];

          snapshot.forEach((doc) => {
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

          if (snapshot.docs.size === 0) {
            console.log("NENHUM FORNECEDOR ENCONTRADO");
            setProviders([{ id: "1", nome: "FULANO" }]);
            setLoadProvider(false);
            return;
          }

          setProviders(lista);
          setLoadProvider(false);

          if(id){
            loadIdProviders(lista);
          }

        })
        .catch((error) => {
          console.log("ERRO AO BUSCAR OS FORNECEDORES", error);
          setLoadProvider(false);
          setProviders([{ id: "1", nome: "FULANO" }]);
        });
    }

    loadProviders();

  }, [id]);

  async function loadIdProviders(lista){
    const docRef = doc(db, "providers", id);
    await getDoc(docRef)
    .then((snapshot) => {
      setNome(snapshot.data().nome);
      setCpf(snapshot.data().cpf);
      setEndereco(snapshot.data().endereco);
      setTelefone(snapshot.data().telefone);
      setInscricaoEstadual(snapshot.data().inscricaoEstadual);
      setProdVendido(snapshot.data().prodVendido);
      setCertificadora(snapshot.data().certificadora);
      setDataCert(snapshot.data().dataCert);

      let index = lista.findIndex(item => item.id === snapshot.data().id)
      setProviderSelected(index);
      setIdProvider(true);
    })
    .catch((error) => {
      console.log(error);
      setIdProvider(false);
    })
  }


  async function handleRegister(e) {
    e.preventDefault();

    if(id){
      //Atualizando fornecedor
      const docRef = doc(db, "providers", id)
      await updateDoc(docRef, {
        nome: nome,
        cpf: cpf,
        endereco: endereco,
        telefone: telefone,
        inscricaoEstadual: inscricaoEstadual,
        prodVendido: prodVendido,
        certificadora: certificadora,
        dataCert: dataCert,
        userId: user?.uid,
      })
      .then(() => {
        toast.info("Fornecedor atualizado com sucesso!");
        setProviderSelected(0);
        navigate('/list-providers');
      })
      .catch((error) => {
        toast.error("Ops, erro ao atualizar esse fornecedor!");
        console.log(error);
      })
     
      return;
    }

    //Cadastrar um fornecedor
    if (
      nome !== "" &&
      cpf !== "" &&
      endereco !== "" &&
      telefone !== "" &&
      inscricaoEstadual !== "" &&
      prodVendido !== "" &&
      certificadora !== "" &&
      dataCert !== ""
    ) {
      await addDoc(collection(db, "providers"), {
        created: new Date(),
        nome: nome,
        cpf: cpf,
        endereco: endereco,
        telefone: telefone,
        inscricaoEstadual: inscricaoEstadual,
        prodVendido: prodVendido,
        certificadora: certificadora,
        dataCert: dataCert,
        userId: user?.uid,
      })
        .then(() => {
          setNome("");
          setCpf("");
          setEndereco("");
          setTelefone("");
          setInscricaoEstadual("");
          setProdVendido("");
          setCertificadora("");
          setDataCert("");
          toast.success("Fornecedor cadastrado!");
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

        <Title name={id ? "Editando Fornecedor" : "Cadastrar Fornecedor"}>
          { id ?  <BsFillPencilFill size={22} /> : <BsPlusCircle size={24} />}
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleRegister}>
            <span>
              <strong>Nome</strong>
            </span>
            <input
              type="text"
              placeholder="Informe o nome do fornecedor"
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
              <strong>Endereço</strong>
            </span>
            <input
              type="text"
              placeholder="Informe o endereço do fornecedor"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
            />

            <span>
              <strong>Telefone</strong>
            </span>
            <input
              type="text"
              placeholder="Informe o telefone do fornecedor"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />

            <span>
              <strong>Inscrição Estadual</strong>
            </span>
            <input
              type="text"
              placeholder="Informe a Inscrição Estadual"
              value={inscricaoEstadual}
              onChange={(e) => setInscricaoEstadual(e.target.value)}
            />

            <span>
              <strong>Produto Vendido</strong>
            </span>
            <input
              type="text"
              placeholder="Informe o(s) produto(s) vendido(s)"
              value={prodVendido}
              onChange={(e) => setProdVendido(e.target.value)}
            />

            <span>
              <strong>Certificadora</strong>
            </span>
            <input
              type="text"
              placeholder="Informe a certificadora responsável"
              value={certificadora}
              onChange={(e) => setCertificadora(e.target.value)}
            />

            <span>
              <strong>Data do Certificado</strong>
            </span>
            <input
              type="text"
              placeholder="Informe a data do certificado"
              value={dataCert}
              onChange={(e) => setDataCert(e.target.value)}
            />

            <button type="submit">{id ? "Atualizar" : "Cadastrar"}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
