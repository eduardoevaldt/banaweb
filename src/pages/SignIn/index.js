import { useState, useContext } from 'react'
import './signin.css'

import logo from '../../assets/logo.png'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../contexts/auth'


export default function SignIn(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signIn, loadingAuth } = useContext(AuthContext)

  async function handleSignIn(e){
    e.preventDefault();

    if(email !== '' && password !== ''){
      await signIn(email, password);
    }

  }

  return(
    <div className="container-center">
      <div className="login">
        <div className="login-area">
          <img src={logo} alt="Logo BanaWeb" />
        </div>

        <form onSubmit={handleSignIn}>
          <h1 className="title-entrar">Login</h1>
          <input 
            type="text" 
            placeholder="Email"
            value={email}
            onChange={ (e) => setEmail(e.target.value) }
          />

          <input 
            type="password" 
            placeholder="Senha"
            value={password}
            onChange={ (e) => setPassword(e.target.value) }
          />

          <button type="submit">
            {loadingAuth ? "Carregando..." : "Entrar"}
          </button>
        </form>

        <Link className="reset-password" to="/reset">Esqueci minha senha</Link>
        <Link className="cadastre-se" to="/register">Ainda não tem conta? <strong>Cadastre-se</strong></Link>

      </div>
    </div>
  )
}