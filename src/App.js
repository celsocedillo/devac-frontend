
import './App.css';
import React, {Fragment} from 'react';
import {  BrowserRouter as Router, Route} from "react-router-dom";
import { Layout  } from 'antd';
import {UserProvider}  from './contexts/userContext';
import login from './pages/login'
import Cabecera from './components/cabecera';
import PrivateRoute from './components/privateRoute';
import Modulos from './modulos/seguridad/pages/modulos';
import CorrespondenciaRouter from './modulos/correspondencia/routers/correspondenciaRouter';
import ActivosRouter from './modulos/activosFijos/routers/activosRouter';
import Sidebar from './components/sideBar';
import HomeUsuario from './pages/HomeUsuario';

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
            <PrivateRoute path='/activos' component={ActivosRouter}/>
            <PrivateRoute path='/homeUsuario' component={HomeUsuario}/>
          </Content>
        </Layout>
      </Layout>
    </Layout>
    {/* <Route path="/redireccion/:usuario/:pagina" component={Redireccion}/> */}
  </Router>    
  </UserProvider>
</Fragment>
        
);
}

export default App;
