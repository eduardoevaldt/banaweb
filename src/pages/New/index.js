import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Header from "../../components/Header";
import Title from "../../components/Title";
import { BsFillCalendar2PlusFill, BsFillPencilFill } from "react-icons/bs";
import { toast } from "react-toastify";

import { AuthContext } from "../../contexts/auth";
import { db } from "../../services/firebaseConnection";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  query,
  orderBy,
  where,
} from "firebase/firestore";

import "./new.css";

const listRefC = collection(db, "collaborators");
const listRefM = collection(db, "machines");

export default function New() {
  const { user } = useContext(AuthContext);
  const [userLoad, setUserLoad] = useState({});

  const { id } = useParams();
  const navigate = useNavigate();

  const [collaborators, setCollaborators] = useState([]);
  const [loadCollaborator, setLoadCollaborator] = useState(true);
  const [collaboratorSelected, setCollaboratorSelected] = useState(0);

  const [machines, setMachines] = useState([]);
  const [loadMachines, setLoadMachines] = useState(true);
  const [machineSelected, setMachineSelected] = useState(0);

  const [descricao, setDescricao] = useState("");
  const [setor, setSetor] = useState("Corte");
  const [area, setArea] = useState("Sítio Grande (50ha)");
  const [andamento, setAndamento] = useState("Em andamento");
  const [idCollaborator, setIdCollaborator] = useState(false);
  const [idMachine, setIdMachine] = useState(false);

  useEffect(() => {
    async function loadCollaborators() {
      const userDetail = localStorage.getItem("@banawebPRO");
      setUserLoad(JSON.parse(userDetail));

      if (userDetail) {
        const data = JSON.parse(userDetail);

        const q = query(
          listRefC,
          orderBy("created", "desc"),
          where("userId", "==", data?.uid)
        );

        const querySnapshot = await getDocs(q)
          .then((snapshot) => {
            let listaC = [];

            snapshot.forEach((doc) => {
              listaC.push({
                id: doc.id,
                nome: doc.data().nome,
              });
            });

            if (snapshot.docs.size === 0) {
              setLoadCollaborator(false);
              return;
            }

            setCollaborators(listaC);
            setLoadCollaborator(false);

            if (id) {
              loadIdCollaborators(listaC);
            }
          })
          .catch((error) => {
            console.log("ERRO AO BUSCAR OS FUNCIONÁRIOS", error);
            setLoadCollaborator(false);
          });
      }
    }

    async function loadMachines() {
      const userDetail = localStorage.getItem("@banawebPRO");
      setUserLoad(JSON.parse(userDetail));

      if (userDetail) {
        const data = JSON.parse(userDetail);

        const q = query(
          listRefM,
          orderBy("created", "desc"),
          where("userId", "==", data?.uid)
        );

        const querySnapshot = await getDocs(q)
          .then((snapshot) => {
            let listaM = [];

            snapshot.forEach((doc) => {
              listaM.push({
                id: doc.id,
                nome: doc.data().nome,
              });
            });

            if (snapshot.docs.size === 0) {
              setLoadMachines(false);
              return;
            }

            setMachines(listaM);
            setLoadMachines(false);

            if (id) {
              loadIdMachines(listaM);
            }
          })
          .catch((error) => {
            console.log("ERRO AO BUSCAR MAQUINARIO", error);
            setLoadMachines(false);
          });
      }
    }

    loadCollaborators();
    loadMachines();
  }, [id]);

  async function loadIdCollaborators(listaC) {
    const docRef = doc(db, "services", id);
    await getDoc(docRef)
      .then((snapshot) => {
        setSetor(snapshot.data().setor);
        setArea(snapshot.data().area);
        setAndamento(snapshot.data().andamento);
        setDescricao(snapshot.data().descricao);

        let index = listaC.findIndex(
          (item) => item.id === snapshot.data().collaboratorId
        );
        setCollaboratorSelected(index);
        setIdCollaborator(true);
      })
      .catch((error) => {
        console.log(error);
        setIdCollaborator(false);
      });
  }

  async function loadIdMachines(listaM) {
    const docRef = doc(db, "services", id);
    await getDoc(docRef)
      .then((snapshot) => {
        setSetor(snapshot.data().setor);
        setArea(snapshot.data().area);
        setAndamento(snapshot.data().andamento);
        setDescricao(snapshot.data().descricao);

        let index = listaM.findIndex(
          (item) => item.id === snapshot.data().machineId
        );
        setMachineSelected(index);
        setIdMachine(true);
      })
      .catch((error) => {
        console.log(error);
        setIdMachine(false);
      });
  }

  function handleOptionChange(e) {
    setAndamento(e.target.value);
  }

  function handleChangeSelectSetor(e) {
    setSetor(e.target.value);
  }

  function handleChangeSelectArea(e) {
    setArea(e.target.value);
  }

  function handleChangeCollaborator(e) {
    setCollaboratorSelected(e.target.value);
  }

  function handleChangeMachine(e) {
    setMachineSelected(e.target.value);
  }

  async function handleRegister(e) {
    e.preventDefault();

    if (
      collaborators.length !== 0 &&
      machines.length !== 0 &&
      idCollaborator &&
      idMachine &&
      setor !== "" &&
      area !== "" &&
      andamento !== ""
    ) {
      //Atualizando serviço
      const docRef = doc(db, "services", id);
      await updateDoc(docRef, {
        setor: setor,
        area: area,
        andamento: andamento,
        descricao: descricao,
        userId: user?.uid,
      })
        .then(() => {
          toast.info("Serviço atualizado com sucesso!");
          setCollaboratorSelected(0);
          setDescricao("");
          navigate("/dashboard");
        })
        .catch((error) => {
          toast.error("Ops, erro ao atualizar esse serviço!");
          console.log(error);
        });
      return;
    } else if (
      collaborators.length !== 0 &&
      machines.length !== 0 &&
      setor !== "" &&
      area !== "" &&
      andamento !== ""
    ) {
      //Registrar um serviço
      await addDoc(collection(db, "services"), {
        created: new Date(),
        collaborator: collaborators[collaboratorSelected].nome,
        collaboratorId: collaborators[collaboratorSelected].id,
        machine: machines[machineSelected].nome,
        machineId: machines[machineSelected].id,
        setor: setor,
        area: area,
        andamento: andamento,
        descricao: descricao,
        userId: user?.uid,
      })
        .then(() => {
          toast.success("Serviço registrado!");
          setDescricao("");
          setCollaboratorSelected(0);
          setMachineSelected(0);
        })
        .catch((error) => {
          toast.error("Erro ao registrar o serviço, tente mais tarde!");
          console.log(error);
        });
      return;
    } else {
      console.log("NÃO FORAM ENCONTRADOS FUNCIONÁRIOS OU MAQUINARIA!");
      toast.error("Preencha todos os campos!");
    }
  }

  return (
    <div>
      <Header />

      <div className="content">
        <Title name={id ? "Editando serviço" : "Novo Serviço"}>
          {id ? (
            <BsFillPencilFill size={22} />
          ) : (
            <BsFillCalendar2PlusFill size={22} />
          )}
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleRegister}>
            <span>
              <strong>Funcionários</strong>
            </span>
            {loadCollaborator ? (
              <input type="text" disabled={true} value="Carregando..." />
            ) : idCollaborator ? (
              <select
                value={collaboratorSelected}
                onChange={handleChangeCollaborator}
                disabled={true}
              >
                {collaborators.map((item, index) => {
                  return (
                    <option key={index} value={index}>
                      {item.nome}
                    </option>
                  );
                })}
              </select>
            ) : (
              <select
                value={collaboratorSelected}
                onChange={handleChangeCollaborator}
              >
                {collaborators.map((item, index) => {
                  return (
                    <option key={index} value={index}>
                      {item.nome}
                    </option>
                  );
                })}
              </select>
            )}

            <span>
              <strong>Maquinaria</strong>
            </span>
            {loadMachines ? (
              <input type="text" disabled={true} value="Carregando..." />
            ) : idMachine ? (
              <select
                value={machineSelected}
                onChange={handleChangeMachine}
                disabled={true}
              >
                {machines.map((item, index) => {
                  return (
                    <option key={index} value={index}>
                      {item.nome}
                    </option>
                  );
                })}
              </select>
            ) : (
              <select 
                value={machineSelected} 
                onChange={handleChangeMachine}
              >
                {machines.map((item, index) => {
                  return (
                    <option key={index} value={index}>
                      {item.nome}
                    </option>
                  );
                })}
              </select>
            )}

            <span>
              <strong>Setor</strong>
            </span>
            <select value={setor} onChange={handleChangeSelectSetor}>
              <option value="Corte">Corte</option>
              <option value="Adubação">Adubação</option>
              <option value="Ensacação">Ensacação</option>
              <option value="Pulverização do Fruto">
                Pulverização do Fruto
              </option>
              <option value="Pulverização Folhar">Pulverização Folhar</option>
              <option value="Pulverização do Solo">Pulverização do Solo</option>
              <option value="Cultivo">Cultivo</option>
              <option value="Manutenção de Maquinário">
                Manutenção de Maquinário
              </option>
            </select>

            <span>
              <strong>Área</strong>
            </span>
            <select value={area} onChange={handleChangeSelectArea}>
              <option value="Sítio Grande">Sítio Grande (50ha)</option>
              <option value="Verônica">Verônica (20ha)</option>
              <option value="Seu Pedro">Seu Pedro (13ha)</option>
              <option value="Sanga Funda">Sanga Funda (37ha)</option>
              <option value="Sítio Grande - Quadro do Galpão">
                Sítio Grande - Quadro do Galpão
              </option>
              <option value="Sítio Grande - Segundo Quadro">
                Sítio Grande - Segundo Quadro
              </option>
              <option value="Sítio Grande - Terceiro Quadro">
                Sítio Grande - Terceiro Quadro
              </option>
              <option value="Sítio Grande - Quadro do Coqueiro">
                Sítio Grande - Quadro do Coqueiro
              </option>
              <option value="VerSítio Grande - Quadro do Mamãoonica">
                Sítio Grande - Quadro do Mamão
              </option>
              <option value="Sítio Grande - Quadro do Trianguinho">
                Sítio Grande - Quadro do Trianguinho
              </option>
              <option value="Sítio Grande - Quadro do Triangão">
                Sítio Grande - Quadro do Triangão
              </option>
              <option value="Sítio Grande - Extrema Verônica">
                Sítio Grande - Extrema Verônica
              </option>
              <option value="Sítio Grande - Quadro do Perau">
                Sítio Grande - Quadro do Perau
              </option>
              <option value="Sítio Grande - Quadro da Goaiba">
                Sítio Grande - Quadro da Goaiba
              </option>
              <option value="Sítio Grande - Quadro da Pedra">
                Sítio Grande - Quadro da Pedra
              </option>
              <option value="Sítio Grande - Quadro da Taquara">
                Sítio Grande - Quadro da Taquara
              </option>
              <option value="Sítio Grande - Quadro do Pé de Louro">
                Sítio Grande - Quadro do Pé de Louro
              </option>
              <option value="Sítio Grande - Quadro das Altonas">
                Sítio Grande - Quadro das Altonas
              </option>
              <option value="Sítio Grande - Quadro do Lagarto">
                Sítio Grande - Quadro do Lagarto
              </option>
              <option value="Sítio Grande - Quadro da Estrada Geral">
                Sítio Grande - Quadro da Estrada Geral
              </option>
              <option value="Sítio Grande - Batista Quadro do Perau">
                Sítio Grande - Batista Quadro do Perau
              </option>
              <option value="Sítio Grande - Batista Quadro Transgênicas">
                Sítio Grande - Batista Quadro Transgênicas
              </option>
              <option value="Verônica - Quadro Transgênicas">
                Verônica - Quadro Transgênicas
              </option>
              <option value="Verônica - Quadro da Extrema Zé Rocha">
                Verônica - Quadro da Extrema Zé Rocha
              </option>
              <option value="Verônica - Quadro da Ladeira">
                Verônica - Quadro da Ladeira
              </option>
              <option value="Verônica - Quadro Extrema do Sítio">
                Verônica - Quadro Extrema do Sítio
              </option>
              <option value="Verônica - Quadro do Perau">
                Verônica - Quadro do Perau
              </option>
              <option value="Seu Pedro - Quadro Transgênicas Grotão">
                Seu Pedro - Quadro Transgênicas Grotão
              </option>
              <option value="Seu Pedro - Quadro Transgênicas">
                Seu Pedro - Quadro Transgênicas
              </option>
              <option value="Seu Pedro - Quadro do Perau">
                Seu Pedro - Quadro do Perau
              </option>
              <option value="Sanga Funda - Quadro do Lucas">
                Sanga Funda - Quadro do Lucas
              </option>
              <option value="Sanga Funda - Quadro do Nego">
                Sanga Funda - Quadro do Nego
              </option>
              <option value="Sanga Funda - Quadro das Transgênicas">
                Sanga Funda - Quadro das Transgênicas
              </option>
              <option value="Sanga Funda - Quadro da Ladeira">
                Sanga Funda - Quadro da Ladeira
              </option>
              <option value="Sanga Funda - Quadro da Cana">
                Sanga Funda - Quadro da Cana
              </option>
              <option value="Sanga Funda - Quadro da Ladeirinha">
                Sanga Funda - Quadro da Ladeirinha
              </option>
              <option value="Sanga Funda - Quadro do Rancho/Esquerda">
                Sanga Funda - Quadro do Rancho/Esquerda
              </option>
              <option value="Sanga Funda - Quadro do Rancho/Direita">
                Sanga Funda - Quadro do Rancho/Direita
              </option>
              <option value="Sanga Funda - Quadro do Perau">
                Sanga Funda - Quadro do Perau
              </option>
              <option value="Sanga Funda - Quadro do Cláudio">
                Sanga Funda - Quadro do Cláudio
              </option>
            </select>

            <span>
              <strong>Andamento</strong>
            </span>
            <div className="status">
              <input
                type="radio"
                name="radio"
                value="Em andamento"
                onChange={handleOptionChange}
                checked={andamento === "Em andamento"}
              />
              <span>Em andamento</span>

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

            {id ? (
              <button type="submit">Atualizar</button>
            ) : (
              <button type="submit">Registrar</button>
            )}
          
          </form>
        </div>
      </div>
    </div>
  );
}
