import { useContext } from 'react'
import avatarImg from '../../assets/avatar.png'
import { Link } from 'react-router-dom'

import { AuthContext } from '../../contexts/auth'
import { BsCardText, BsPeopleFill, BsPersonCircle,BsPersonLinesFill, BsHammer } from 'react-icons/bs'
import './header.css';

export default function Header(){
  const { user } = useContext(AuthContext);

  return(
    <div className="sidebar">
      <div>
        <img src={user.avatarUrl === null ? avatarImg : user.avatarUrl} alt="Foto do usuario" />
      </div>

      <Link to="/dashboard">
        <BsCardText color="#FFF" size={20} />
        Serviços
      </Link>

      <Link to="/list-collaborators">
        <BsPeopleFill color="#FFF" size={20} />
        Funcionários
      </Link>

      <Link to="/list-providers">
        <BsPersonLinesFill color="#FFF" size={20} />
        Fornecedores
      </Link>

      <Link to="/list-machines">
        <BsHammer color="#FFF" size={20} />
        Maquinaria
      </Link>

      <Link to="/profile">
        <BsPersonCircle color="#FFF" size={20} />
        Perfil
      </Link>
    </div>
  )
}