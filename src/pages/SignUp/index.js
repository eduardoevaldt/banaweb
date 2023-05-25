import { useState, useContext } from 'react'
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom'

import { AuthContext } from '../../contexts/auth'

export default function SignUp(){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signUp, loadingAuth } = useContext(AuthContext);

  async function handleSubmit(e){
    e.preventDefault();

    if(name !== '' && email !== '' && password !== ''){
     await signUp(email, password, name)
    }

  }

  return(
    <div className="container-center">
      <div className="login">
        <div className="login-area">
          <img src={logo} alt="Logo BanaWeb" />
        </div>

        <form onSubmit={handleSubmit}>
          <h1 className="title-entrar">Nova Conta</h1>
          <input 
            type="text" 
            placeholder="Nome"
            value={name}
            onChange={ (e) => setName(e.target.value) }
          />

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
            {loadingAuth ? <div class="spinner-border text-light"></div> : 'Cadastrar'}
          </button>
        </form>

        <Link className="reset-password" to="/">Já possui uma conta? <strong>Entrar</strong></Link>

      </div>
    </div>
  )
}