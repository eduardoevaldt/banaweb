import { Routes, Route } from 'react-router-dom'

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Dashboard from '../pages/Dashboard'
import Profile from '../pages/Profile';
import ResetPassword from '../pages/ResetPassword'
import ListCollaborators from '../pages/ListCollaborators';
import CreateCollaborators from '../pages/CreateCollaborators';
import New from '../pages/New';
import ListMachines from '../pages/ListMachines';
import CreateMachines from '../pages/CreateMachines';
import ListProviders from '../pages/ListProviders';
import CreateProviders from '../pages/CreateProviders';

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
       <Route path="/create-collaborators/:id" element={ 
        <Private>
          <CreateCollaborators/> 
        </Private>
      } />
      <Route path="/new" element={ 
        <Private>
          <New/> 
        </Private>
      } />
      <Route path="/new/:id" element={ 
        <Private>
          <New/> 
        </Private>
      } />
       <Route path="/list-machines" element={ 
        <Private>
          <ListMachines/> 
        </Private>
      } />
        <Route path="/create-machines" element={ 
        <Private>
          <CreateMachines/> 
        </Private>
      } />
       <Route path="/create-machines/:id" element={ 
        <Private>
          <CreateMachines/> 
        </Private>
      } />
      <Route path="/list-providers" element={ 
        <Private>
          <ListProviders/> 
        </Private>
      } />
      <Route path="/create-providers" element={ 
        <Private>
          <CreateProviders/> 
        </Private>
      } />
      <Route path="/create-providers/:id" element={ 
        <Private>
          <CreateProviders/> 
        </Private>
      } />

    </Routes>    
  )
}

export default RoutesApp;