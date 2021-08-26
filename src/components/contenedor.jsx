
import React, { useContext, useEffect } from 'react';
import {   Switch, Route} from "react-router-dom";

import { Layout } from 'antd';

import Cabecera from './layouts/cabecera'
import UserContext  from '../contexts/userContext';
import  Login   from "./login";

import EnEspera from './enEspera';
import  Oficio  from './oficio';
import  Oficios  from './oficios';
import Sidebar from './layouts/sideBar';

const { Content } = Layout;

const Contenedor = () => {

  console.log('Contenedor');

  const { usuario, setUsuario } = useContext(UserContext);
    return (
        <div>
            {usuario  
               ?  
                <Layout>
                  <Cabecera/>
                  <Layout>

                  <Sidebar/>
                  <Content>
                  <Switch>
                    <Route exact path="/enEspera" component={EnEspera} />
                    <Route exact path="/oficio/:id" >
                      <Oficio/>
                    </Route>
                    <Route exact path="/oficios" >
                      <Oficios/>
                    </Route>
                    </Switch>              
                  </Content>
                  </Layout>
                </Layout>

               :  
            <Login></Login>
         } 
        </div>
    )
}

export default Contenedor
