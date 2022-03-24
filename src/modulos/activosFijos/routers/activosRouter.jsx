import React, { Fragment } from "react";
import PrivateRoute from "../../../components/privateRoute";
import ListaCambioCustodioUsuarios from "../pages/ListaSolicitudCambioCustodioUsuario"; 
import SolicitudCambioCustodio from "../pages/SolicitudCambioCustodio";
  
  const ActivosRouter = () => {
    return (
        <Fragment>
                <PrivateRoute exact path='/activos/solicitudCambio' component={ListaCambioCustodioUsuarios}/>
                <PrivateRoute exact path='/activos/solicitudCambio/:anio/:actaId' component={SolicitudCambioCustodio}/>
        </Fragment> 
    )
  }

  export default ActivosRouter