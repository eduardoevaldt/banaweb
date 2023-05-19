import { useContext, useState } from 'react'
import Header from '../../components/Header'
import Title from '../../components/Title'

import { BsPersonCircle, BsUpload } from 'react-icons/bs'
import avatar from '../../assets/avatar.png'
import {AuthContext} from '../../contexts/auth'

import { db, storage } from '../../services/firebaseConnection'
import { doc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

import './profile.css';
import { toast } from 'react-toastify'

export default function Profile(){
  
  const { user, storageUser, setUser, logout } = useContext(AuthContext);
  const [imageAvatar, setImageAvatar] = useState(null);
  
  const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl)
  const [email, setEmail] = useState(user && user.email);
  const [nome, setNome] = useState(user && user.nome)

  function handleFile(e){
    if(e.target.files[0]){
      const image = e.target.files[0];

      if(image.type === 'image/jpeg' || image.type === 'image/png'){
        setImageAvatar(image)
        setAvatarUrl(URL.createObjectURL(image))
      }else{
        toast.warning("Envie uma imagem do tipo PNG ou JPEG.");
        setImageAvatar(null);
        return;
      }


    }
  }

  async function handleUpload(){
    const currentUid = user.uid;

    const uploadRef = ref(storage, `images/${currentUid}/${imageAvatar.name}`)

    const uploadTask = uploadBytes(uploadRef, imageAvatar)
    .then((snapshot) =>{
      
      getDownloadURL(snapshot.ref).then( async (downloadURL) => {
        let urlFoto = downloadURL;

        const docRef = doc(db, "users", user.uid)
        await updateDoc(docRef, {
          avatarUrl: urlFoto,
          nome: nome,
        })
        .then(() => {
          let data = {
            ...user,
            nome: nome,
            avatarUrl: urlFoto,
          }
   
          setUser(data);
          storageUser(data);
          toast.success("Atualizado com sucesso!")
          
        })

      })

    })

  }

  async function handleSubmit(e){
    e.preventDefault();

   if(imageAvatar === null && nome !== ''){
     // Atualizar apenas o nome do user
     const docRef = doc(db, "users", user.uid) 
     await updateDoc(docRef, {
       nome: nome,
     })
     .then(() => {
       let data = {
         ...user,
         nome: nome,
       }

       setUser(data);
       storageUser(data);
       toast.success("Atualizado com sucesso!")

     })

   }else if(nome !== '' && imageAvatar !== null){
     // Atualizar tanto nome quanto a foto
     handleUpload()
   }

  }

  return(
    <div>
    <Header/>

    <div className="content">
      <Title name="Meu perfil">
        <BsPersonCircle size={25} />
      </Title>

     <div className="container">

      <form className="form-profile" onSubmit={handleSubmit}>
        <label className="label-avatar">
          <span>
            <BsUpload color="#FFF" size={25} />
          </span>

          <input type="file" accept="image/*" onChange={handleFile}  /> <br/>
          {avatarUrl === null ? (
            <img src={avatar} alt="Foto de perfil" width={250} height={250} />
          ) : (
            <img src={avatarUrl} alt="Foto de perfil" width={250} height={250} />
          )}

        </label>

        <span><strong>Nome</strong></span>
        <br/>
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
        <span><strong>Email</strong></span>
        <br/>
        <input type="text" value={email}  disabled={true} />
        
        <button type="submit">Salvar</button>
      </form>

    </div>

     <div className="container">
       <button className="logout-btn"onClick={() => logout()} >Sair da Conta</button>
     </div>

    </div>

  </div>
  )
}