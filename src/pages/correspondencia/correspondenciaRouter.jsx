import React, { Fragment } from "react";
import PrivateRoute from "../../components/privateRoute";
import EnEspera from "./enEspera";
import Oficios from './oficios'
import Oficio from './oficio'
import BandejaSumillas from './bandejaSumillas'

  
  const CorrespondenciaRouter = () => {
    return (
        <Fragment>
              <PrivateRoute exact path='/correspondencia/espera' component={EnEspera}/>
              <PrivateRoute exact path='/correspondencia/oficios' component={Oficios}/>
              <PrivateRoute exact path='/correspondencia/oficio/:id' component={Oficio}/>
              <PrivateRoute exact path='/correspondencia/bandejaSumillas' component={BandejaSumillas}/>
        </Fragment> 
    )
  }

  export default CorrespondenciaRouter