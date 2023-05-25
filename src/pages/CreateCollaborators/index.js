import { useContext, useState, useEffect} from 'react'
import Header from '../../components/Header'
import Title from '../../components/Title'
import { BsPlusCircle } from 'react-icons/bs'
import { toast } from 'react-toastify'

import { db } from '../../services/firebaseConnection'
import { addDoc, collection } from 'firebase/firestore'

//import {AuthContext} from '../../contexts/auth'

export default function CreateCollaborators(){

  //const { user } = useContext(AuthContext);

  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [funcao, setFuncao] = useState('')
  const [cbo, setCbo] = useState('')
  const [telefone, setTelefone] = useState('')
  const [endereco, setEndereco] = useState('')
  

  async function handleRegister(e){
    e.preventDefault();

    if(nome !== '' && cpf !== '' && funcao !=='' && cbo !=='' && telefone !=='' && endereco !== ''){
    
        await addDoc(collection(db, "collaborators"), {
          created: new Date(),
          nome: nome,
          cpf: cpf,
          funcao: funcao,
          cbo: cbo,
          telefone: telefone,
          endereco: endereco,
          //userId: user.uid
        })
        .then(() => {
          setNome('')
          setCpf('')
          setFuncao('')
          setCbo('')
          setTelefone('')
          setEndereco('')
          toast.success("Funcionário cadastrado!")
        })
        .catch((error) => {
          console.log(error);
          toast.error("Erro ao fazer o cadastro.")
        })

    }else{
      toast.error("Preencha todos os campos!")
    }

  }

  return(
    <div>
      <Header/>

      <div className="content">
        <Title name="Cadastrar Funcionário">
          <BsPlusCircle size={25} />
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleRegister}>
              <span><strong>Nome</strong></span>
              <input
                type="text"
                placeholder="Informe o nome"
                value={nome}
                onChange={(e) => setNome(e.target.value) }
              />

              <span><strong>CPF</strong></span>
              <input
                type="text"
                placeholder="Informe o CPF"
                value={cpf}
                onChange={(e) => setCpf(e.target.value) }
              />
              
              <span><strong>Função</strong></span>
              <input
                type="text"
                placeholder="Informe a funcão"
                value={funcao}
                onChange={(e) => setFuncao(e.target.value) }
              />

              <span><strong>CBO</strong></span>
              <input
                type="text"
                placeholder="Informe o número CBO"
                value={cbo}
                onChange={(e) => setCbo(e.target.value) }
              />
              
              <span><strong>Telefone</strong></span>
              <input
                type="text"
                placeholder="Informe o telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value) }
              />

              <span><strong>Endereço</strong></span>
              <input
                type="text"
                placeholder="Informe o endereço"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value) }
              />

              <button type="submit">
                Cadastrar
              </button>
          </form>
        </div>

      </div>

    </div>
  )
}