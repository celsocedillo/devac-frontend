import React, { Fragment, useContext } from "react";
import PrivateRoute from "../../../components/privateRoute";
import EnEspera from "../pages/enEspera";
import Oficios from '../pages/oficios';
import Oficio from '../pages/oficio';
import ReservaOficio from '../pages/reserva'
import ReservasOficio from '../pages/reservas'
import BandejaSumillas from '../pages/bandejaSumillas'
import UserContext from "../../../contexts/userContext";



  
  const CorrespondenciaRouter = () => {

    const {usuario} = useContext(UserContext)
    return (
      //usuario?.usuarioSecretaria ?
        <Fragment>
          <PrivateRoute exact path='/correspondencia/espera' component={EnEspera}/>
          <PrivateRoute exact path='/correspondencia/bandejaSumillas' component={BandejaSumillas}/>
          <PrivateRoute exact path='/correspondencia/oficios' component={Oficios}/>
          <PrivateRoute exact path='/correspondencia/oficio/:id' component={Oficio}/>
          <PrivateRoute exact path='/correspondencia/reservas' component={ReservasOficio}/>
          <PrivateRoute exact path='/correspondencia/reserva/:tipoOficioId/:anio/:numeroOficio' component={ReservaOficio}/>
          <PrivateRoute exact path='/correspondencia/reserva' component={ReservaOficio}/>
        </Fragment>
      // :
      //   <Fragment>
      //     <PrivateRoute exact path='/correspondencia/espera' component={EnEspera}/>
      //     <PrivateRoute exact path='/correspondencia/bandejaSumillas' component={BandejaSumillas}/>
      //     <PrivateRoute exact path='/correspondencia/reservas' component={ReservasOficio}/>
      //     <PrivateRoute exact path='/correspondencia/reserva/:tipoOficioId/:anio/:numeroOficio' component={ReservaOficio}/>                    
      //     <PrivateRoute exact path='/correspondencia/reserva' component={ReservaOficio}/>
          
      //   </Fragment>
    )
  }

  export default CorrespondenciaRouter