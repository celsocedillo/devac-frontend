import React, { useContext } from 'react';
import { Layout, Button } from 'antd';
import { IoPerson, IoHome, IoExit  } from 'react-icons/io5'
import UserContext from '../contexts/userContext';
import { useHistory } from 'react-router-dom';
import { Fragment } from 'react';




const {Header} = Layout;

const Cabecera  = () => {
    const history = useHistory();

    const {usuario, logout} = useContext(UserContext);
    const handleLogout = () => {
        logout();
        history.push('/');
    }

return(
    <Fragment>
    {
        usuario  &&
        <Header >
        <div className="logo">
        <span style={{color:'white'}}><IoHome/> EMAPAG</span>
        </div>
        <div style={{float: 'right'}}>
        <span style={{color:'white'}}><IoPerson/> {usuario?.usuarioDisplay}</span>
        <Button type='text' size='small' style={{color:'white', marginLeft: '5px'}} onClick={() => handleLogout()}><IoExit/></Button>
        </div>
        </Header>        
    }

    </Fragment>

    
    
);
}
export default Cabecera;