import { useState, useEffect, useContext } from "react";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { BsPlusCircle } from "react-icons/bs";
import { toast } from "react-toastify";

import { AuthContext } from "../../contexts/auth";
import { db } from "../../services/firebaseConnection";
import { collection, getDocs, getDoc, doc, addDoc } from "firebase/firestore";

import "./new.css";

const listRefC = collection(db, "collaborators");
const listRefM = collection(db, "machines");

export default function New() {
  const { user } = useContext(AuthContext);

  const [collaborators, setCollaborators] = useState([]);
  const [loadCollaborator, setLoadCollaborator] = useState(true);
  const [collaboratorSelected, setCollaboratorSelected] = useState(0)

  const [machines, setMachines] = useState([]);
  const [loadMachines, setLoadMachines] = useState(true);
  const [machineSelected, setMachineSelected] = useState(0)

  const [descricao, setDescricao] = useState("");
  const [setor, setSetor] = useState("Corte");
  const [area, setArea] = useState("Sitio");
  const [andamento, setAndamento] = useState("Aberto");

  useEffect(() => {

    async function loadCollaborators() {
      const querySnapshot = await getDocs(listRefC)
        .then((snapshot) => {
          let listaC = [];

          snapshot.forEach((doc) => {
            listaC.push({
              id: doc.id,
              nome: doc.data().nome,
            });
          });

          if (snapshot.docs.size === 0) {
            console.log("NENHUM FUNCIONÁRIO ENCONTRADO");
            setCollaborators([{ id: "1", nome: "FULANO" }]);
            setLoadCollaborator(false);
            return;
          }

          setCollaborators(listaC);
          setLoadCollaborator(false);
        })
        .catch((error) => {
          console.log("ERRO AO BUSCAR OS FUNCIONÁRIOS", error);
          setLoadCollaborator(false);
          setCollaborators([{ id: "1", nome: "FULANO" }]);
        });
    }

    async function loadMachines() {
      const querySnapshot = await getDocs(listRefM)
        .then((snapshot) => {
          let listaM = [];

          snapshot.forEach((doc) => {
            listaM.push({
              id: doc.id,
              nome: doc.data().nome,
            });
          });

          if (snapshot.docs.size === 0) {
            console.log("NENHUMA MÁQUINA ENCONTRADA");
            setMachines([{ id: "1", nome: "SEM MÁQUINA ADICIONADA" }]);
            setLoadMachines(false);
            return;
          }

          setMachines(listaM);
          setLoadMachines(false);
        })
        .catch((error) => {
          console.log("ERRO AO BUSCAR MAQUINÁRIO", error);
          setLoadMachines(false);
          setMachines([{ id: "1", nome: "SEM MÁQUINA ADICIONADA" }]);
        });
    }

    loadCollaborators();
    loadMachines();

  }, []);

  function handleOptionChange(e) {
    setAndamento(e.target.value);
  }

  function handleChangeSelectSetor(e) {
    setSetor(e.target.value);
  }
  
  function handleChangeSelectArea(e){
    setArea(e.target.value);
  }

  function handleChangeCollaborator(e){
    setCollaboratorSelected(e.target.value)
  }

  function handleChangeMachine(e){
    setMachineSelected(e.target.value)
  }

  async function handleRegister(e){
    e.preventDefault();

    //Registrar um serviço
    await addDoc(collection(db, "services"),{
      created: new Date(),
      collaborator: collaborators[collaboratorSelected].nome,
      collaboratorId: collaborators[collaboratorSelected].id,
      machines: machines[machineSelected].nome,
      machineId: machines[machineSelected].id,
      setor: setor,
      area: area,
      andamento: andamento,
      descricao: descricao,
      userId: user.uid
    })
    .then(() => {
      toast.success("Serviço registrado!")
      setDescricao('')
      setCollaboratorSelected(0)
      setMachineSelected(0)
    })
    .catch((error) => {
      toast.error("Erro ao registrar, tente mais tarde!")
      console.log(error);
    })
  }

  return (
    <div>
      <Header />

      <div className="content">
        <Title name="Novo Serviço">
          <BsPlusCircle size={25} />
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleRegister}>
            <span>
              <strong>Funcionários</strong>
            </span>
            {
              loadCollaborator ? (
                <input type="text" disabled={true} value="Carregando..." />
              ) : (
                <select value={collaboratorSelected} onChange={handleChangeCollaborator}>
                  {collaborators.map((item, index) => {
                    return(
                      <option key={index} value={index}>
                        {item.nome}
                      </option>
                    )
                  })}
                </select>
              )
            }

            <span>
              <strong>Maquinaria</strong>
            </span>
            {
              loadMachines ? (
                <input type="text" disabled={true} value="Carregando..." />
              ) : (
                <select value={machineSelected} onChange={handleChangeMachine}>
                  {machines.map((item, index) => {
                    return(
                      <option key={index} value={index}>
                        {item.nome}
                      </option>
                    )
                  })}
                </select>
              )
            }

            <span>
              <strong>Setor</strong>
            </span>
            <select value={setor} onChange={handleChangeSelectSetor}>
              <option value="Corte">Corte</option>
              <option value="Adubação">Adubação</option>
              <option value="Ensacação">Ensacação</option>
              <option value="Pulverização">Pulverização</option>
              <option value="Serviços Gerais">Serviços Gerais</option>
            </select>

            <span>
              <strong>Área</strong>
            </span>
            <select value={area} onChange={handleChangeSelectArea}>
              <option value="Sitio">Sítio Grande - Taquara</option>
              <option value="Sitio">Sítio Grande - Pé de Louro</option>
              <option value="Sitio">Sítio Grande - Transgênicas</option>
              <option value="Sitio">Sítio Grande - Triangão</option>
              <option value="Sitio">Sítio Grande - Trianguinho</option>
              <option value="Sitio">Sítio Grande - Galpão</option>
              <option value="Sitio">Sítio Grande - Perau</option>
              <option value="Seu Pedro">Seu Pedro</option>
              <option value="Veronica">Verônica</option>
              <option value="Sanga Funda">Sanga Funda</option>
            </select>

            <span>
              <strong>Andamento</strong>
            </span>
            <div className="status">
              <input
                type="radio"
                name="radio"
                value="Aberto"
                onChange={handleOptionChange}
                checked={andamento === "Aberto"}
              />
              <span>Aberto</span>

              <input
                type="radio"
                name="radio"
                value="Progresso"
                onChange={handleOptionChange}
                checked={andamento === "Progresso"}
              />
              <span>Progresso</span>

              <input
                type="radio"
                name="radio"
                value="Terminado"
                onChange={handleOptionChange}
                checked={andamento === "Terminado"}
              />
              <span>Terminado</span>
            </div>

            <span>
              <strong>Descrição do Serviço</strong>
            </span>
            <textarea
              type="text"
              placeholder="Descreva o serviço"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />

            <button type="submit">Registrar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
