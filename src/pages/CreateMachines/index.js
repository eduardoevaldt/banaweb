import { useContext, useState, useEffect } from "react";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { BsPlusCircle } from "react-icons/bs";
import { toast } from "react-toastify";

import { db } from "../../services/firebaseConnection";
import { addDoc, collection } from "firebase/firestore";

import {AuthContext} from '../../contexts/auth'

export default function CreateMachines() {
  const { user } = useContext(AuthContext);
  
  const [categoria, setCategoria] = useState("Veiculo");
  const [nome, setNome] = useState("");
  const [marca, setMarca] = useState("");
  const [descricao, setDescricao] = useState("");

  async function handleRegister(e) {
    e.preventDefault();

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
        userId: user?.uid
      })
        .then(() => {
          setCategoria("");
          setNome("");
          setMarca("");
          setDescricao("");
          toast.success("Item de maquinaria cadastrado!");
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
        <Title name="Adicionar Máquina">
          <BsPlusCircle size={25} />
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

            <button type="submit">Cadastrar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
