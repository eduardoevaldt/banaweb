import React, { useState } from 'react'
import './resetpassword.css'
import logo from '../../assets/logo.png'
import { Link } from 'react-router-dom'

import { toast } from 'react-toastify';
import { auth } from '../../services/firebaseConnection';
import { sendPasswordResetEmail } from 'firebase/auth'
import {} from 'firebase/firestore';


export default function ResetPassword(){

    const [email, setEmail] = useState('');


    function recuperationPassword(){
       sendPasswordResetEmail(auth, email)
       .then(result =>{
        toast.success("Sucesso! Verifique seu e-mail.")
       }).catch(erro =>{
        toast.error("E-mail inválido!")
       })
    }

  return(
    <div className="container-center">
      <div className="login">
        <div className="login-area">
          <img src={logo} alt="Logo BanaWeb" />
        </div>

        <form>
          <h1 className="title-entrar">Recuperação de Senha</h1>
          <br/>
          <input 
            type="text" 
            placeholder="Informe o e-mail cadastrado"
            value={email}
            onChange={ (e) => setEmail(e.target.value) }
          />

            <button onClick={recuperationPassword} type="button">
                Enviar
            </button>

        </form>

        <Link className="cadastre-se" to="/register">Ainda não tem conta? <strong>Cadastre-se</strong></Link>
        <Link className="voltarLogin" to="/"><strong>Entrar</strong></Link>

      </div>
    </div>
  )
}