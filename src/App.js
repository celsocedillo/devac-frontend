
import './App.css';
import React, { Fragment } from 'react';

import Cabecera from './components/layouts/cabecera'
import { Layout } from 'antd';
import {  BrowserRouter as Router, Switch, Route} from "react-router-dom";
import EnEspera from './components/enEspera';
import  Oficio  from './components/oficio';
import  Oficios  from './components/oficios';

const { Content } = Layout;

function App() {
  return (
    <Fragment>
      
    <Router>
      
        
          <Layout>
            <Cabecera/>
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
      
    </Router>
    </Fragment>
  );
}

export default App;
