import { useState, useEffect, useContext } from "react";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { BsPlusCircle } from "react-icons/bs";

import { AuthContext } from "../../contexts/auth";
import { db } from "../../services/firebaseConnection";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";

import "./new.css";

const listRef = collection(db, "collaborators");

export default function New() {
  const { user } = useContext(AuthContext);

  const [collaborators, setCollaborators] = useState([]);
  const [loadCollaborator, setLoadCollaborator] = useState(true);
  const [collaboratorSelected, setCollaboratorSelected] = useState(0)


  const [descricao, setDescricao] = useState("");
  const [servico, setServico] = useState("Corte");
  const [area, setArea] = useState("Sitio");
  const [andamento, setAndamento] = useState("Aberto");

  useEffect(() => {
    async function loadCollaborators() {
      const querySnapshot = await getDocs(listRef)
        .then((snapshot) => {
          let lista = [];

          snapshot.forEach((doc) => {
            lista.push({
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

          setCollaborators(lista);
          setLoadCollaborator(false);
        })
        .catch((error) => {
          console.log("ERRRO AO BUSCAR OS FUNCIONÁRIOS", error);
          setLoadCollaborator(false);
          setCollaborators([{ id: "1", nome: "FULANO" }]);
        });
    }

    loadCollaborators();
  }, []);

  function handleOptionChange(e) {
    setAndamento(e.target.value);
  }

  function handleChangeSelectServico(e) {
    setServico(e.target.value);
  }
  
  function handleChangeSelectArea(e){
    setArea(e.target.value);
  }

  function handleChangeCollaborator(e){
    setCollaboratorSelected(e.target.value)
    console.log(collaborators[e.target.value].nome);
  }

  return (
    <div>
      <Header />

      <div className="content">
        <Title name="Nova Tarefa">
          <BsPlusCircle size={25} />
        </Title>

        <div className="container">
          <form className="form-profile">
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
              <strong>Serviço</strong>
            </span>
            <select value={servico} onChange={handleChangeSelectServico}>
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
              <option value="Sitio">Sítio</option>
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
