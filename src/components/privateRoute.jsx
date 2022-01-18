import React, { useContext } from 'react';
import { Route, Redirect } from "react-router-dom";
import UserContext from '../contexts/userContext'

const PrivateRoute = ({component: Component, ...rest}) =>{

    const {usuario} = useContext(UserContext);
    //console.log('private route', usuario);

return (
    <Route {...rest}>
        {(usuario || window.localStorage.getItem('sesionUsuario')) ?
        <Component/>
        :
        <Redirect to='/'/>
        }
        
    </Route>
)

}
export default PrivateRoute;