
import './App.css';
import React, {Fragment} from 'react';
import {  BrowserRouter as Router, Route} from "react-router-dom";
import { Layout  } from 'antd';
import {UserProvider}  from './contexts/userContext';
import login from './pages/login'
import Cabecera from './components/cabecera';
import PrivateRoute from './components/privateRoute';
import Modulos from './pages/modulos';
import CorrespondenciaRouter from './pages/correspondencia/correspondenciaRouter';
import Sidebar from './components/sideBar';


const { Content } = Layout;


function App() {
  
return (

<Fragment>
  <UserProvider>
  <Router>
    <Layout>
      <Cabecera/>
      <Layout>
        <Sidebar/>
        <Layout>
        <Content style={{minHeight: 540}}>
        <Route exact path='/' component={login}/>
        <PrivateRoute exact path='/listaModulos' component={Modulos}/>
        <PrivateRoute path='/correspondencia' component={CorrespondenciaRouter}/>
        </Content>
        </Layout>
        </Layout>
    </Layout>
  </Router>    
  </UserProvider>
</Fragment>
        
);
}

export default App;
