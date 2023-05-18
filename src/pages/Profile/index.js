import Header from '../../components/Header'
import Title from '../../components/Title'

import { BsPersonCircle } from 'react-icons/bs'

export default function Profile(){
  return(
    <div>
      <Header/>

      <div className="content">
        <Title name="Meu perfil">
          <BsPersonCircle size={25} />
        </Title>
        
      </div>

    </div>
  )
}