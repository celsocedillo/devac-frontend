import React, { Fragment } from "react";
import {BrowserRouter as Router,Switch} from "react-router-dom";
import PrivateRoute from "../../components/privateRoute";
import EnEspera from "../correspondencia/enEspera";
  
  const ActivosRouter = () => {
    return (
        <Fragment>
            <Router>
                <Switch>
                <PrivateRoute exact path='/activos/espera' component={EnEspera}/>
                </Switch>
            </Router>
        </Fragment> 
    )
  }

  export default ActivosRouter