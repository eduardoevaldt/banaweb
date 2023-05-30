import { Routes, Route } from 'react-router-dom'

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Dashboard from '../pages/Dashboard'
import Profile from '../pages/Profile';
import ResetPassword from '../pages/ResetPassword'
import ListCollaborators from '../pages/ListCollaborators';
import CreateCollaborators from '../pages/CreateCollaborators';
import New from '../pages/New';
import CreateMachines from '../pages/CreateMachines';

import Private from './Private'

function RoutesApp(){
  return(
    <Routes>
      <Route path="/" element={ <SignIn/> } />
      <Route path="/register" element={ <SignUp/> } />
      <Route path="/reset" element={ <ResetPassword/> } />
      <Route path="/dashboard" element={ 
        <Private>
          <Dashboard/> 
        </Private>
      } />
      <Route path="/profile" element={ 
        <Private>
          <Profile/> 
        </Private>
      } />
      <Route path="/list-collaborators" element={ 
        <Private>
          <ListCollaborators/> 
        </Private>
      } />
      <Route path="/create-collaborators" element={ 
        <Private>
          <CreateCollaborators/> 
        </Private>
      } />
      <Route path="/new" element={ 
        <Private>
          <New/> 
        </Private>
      } />
        <Route path="/machines" element={ 
        <Private>
          <CreateMachines/> 
        </Private>
      } />

    </Routes>    
  )
}

export default RoutesApp;