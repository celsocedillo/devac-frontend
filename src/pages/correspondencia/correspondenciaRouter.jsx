import React, { Fragment, useContext } from "react";
import PrivateRoute from "../../components/privateRoute";
import EnEspera from "./enEspera";
import Oficios from './oficios'
import Oficio from './oficio'
import BandejaSumillas from './bandejaSumillas'
import UserContext from "../../contexts/userContext";



  
  const CorrespondenciaRouter = () => {

    const {usuario} = useContext(UserContext)
    return (
      usuario?.usuarioSecretaria ?
        <Fragment>
          <PrivateRoute exact path='/correspondencia/espera' component={EnEspera}/>
          <PrivateRoute exact path='/correspondencia/bandejaSumillas' component={BandejaSumillas}/>
          <PrivateRoute exact path='/correspondencia/oficios' component={Oficios}/>
          <PrivateRoute exact path='/correspondencia/oficio/:id' component={Oficio}/>
          
        </Fragment>
      :
        <Fragment>
          <PrivateRoute exact path='/correspondencia/bandejaSumillas' component={BandejaSumillas}/>
        </Fragment>
    )
  }

  export default CorrespondenciaRouter