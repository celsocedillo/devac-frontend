
import './App.css';
import React, { Fragment } from 'react';

import Cabecera from './components/layouts/cabecera'
import { Layout } from 'antd';
import {  BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Oficios from './components/oficios';
// import Contrato from './components/contrato';
// import Redireccion from './components/redireccion';

const { Content } = Layout;

function App() {
  return (
    <Fragment>
      
    <Router>
      <Switch>
        <Route exact path={["/oficios"]}>
          <Layout>
            <Cabecera/>
            <Content>
              <Route exact path="/oficios" component={Oficios} />
              {/* <Route exact path="/contrato/:id" component={Contrato} />
              <Route exact path="/contrato" component={Contrato} /> */}
            </Content>
          </Layout>
        </Route>
        {/* <Route path="/redireccion/:usuario" component={Redireccion}/> */}
      </Switch>
    </Router>
    </Fragment>
  );
}

export default App;
