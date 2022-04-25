import React, { Fragment } from "react";
import PrivateRoute from "../../../components/privateRoute";
import ListaCambioCustodioUsuarios from "../pages/ListaSolicitudCambioCustodioUsuario"; 
import SolicitudCambioCustodio from "../pages/SolicitudCambioCustodio";
import ListaAprobacionCambioCustodio  from '../pages/ListaAprobacionCambioCustodio'
import AprobarSolicitudCambioCustodio from "../pages/AprobarSolicitudCambioCustodio";
  
  const ActivosRouter = () => {
    return (
        <Fragment>
                <PrivateRoute exact path='/activos/solicitudCambio' component={ListaCambioCustodioUsuarios}/>
                <PrivateRoute exact path='/activos/solicitudCambio/:anio/:actaId' component={SolicitudCambioCustodio}/>
                <PrivateRoute exact path='/activos/aprobacion/solicitudCambio' component={ListaAprobacionCambioCustodio}/>
                <PrivateRoute exact path='/activos/aprobacion/solicitudCambio/:anio/:actaId' component={AprobarSolicitudCambioCustodio}/>
        </Fragment> 
    )
  }

  export default ActivosRouter