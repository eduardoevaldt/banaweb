import { useContext } from 'react'
import avatarImg from '../../assets/avatar.png'
import { Link } from 'react-router-dom'

import { AuthContext } from '../../contexts/auth'
import { BsHouseFill, BsPeopleFill, BsPersonCircle } from 'react-icons/bs'
import './header.css';

export default function Header(){
  const { user } = useContext(AuthContext);

  return(
    <div className="sidebar">
      <div>
        <img src={user.avatarUrl === null ? avatarImg : user.avatarUrl} alt="Foto do usuario" />
      </div>

      <Link to="/dashboard">
        <BsHouseFill color="#FFF" size={20} />
        Tarefas
      </Link>

      <Link to="/list-collaborators">
        <BsPeopleFill color="#FFF" size={20} />
        Funcionários
      </Link>

      <Link to="/profile">
        <BsPersonCircle color="#FFF" size={20} />
        Perfil
      </Link>
    </div>
  )
}