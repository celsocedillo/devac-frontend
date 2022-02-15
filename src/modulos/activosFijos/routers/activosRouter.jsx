import React, { Fragment } from "react";
import PrivateRoute from "../../../components/privateRoute";
import ListaCambioCustodioUsuarios from "../pages/cambioCustodiosUsuario"; 
  
  const ActivosRouter = () => {
    return (
        <Fragment>
                <PrivateRoute exact path='/activos/solicitudCambio' component={ListaCambioCustodioUsuarios}/>
        </Fragment> 
    )
  }

  export default ActivosRouter