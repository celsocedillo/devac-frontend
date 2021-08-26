import React, { useContext } from 'react';
import { Layout, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faUser } from '@fortawesome/free-solid-svg-icons'
import { IoPerson, IoHome, IoExit  } from 'react-icons/io5'
import UserContext from '../../contexts/userContext';
import { Link } from 'react-router-dom';




const {Header} = Layout;

const Cabecera  = () => {

    const {usuario, logout} = useContext(UserContext);

    const handleLogout = () => {
        logout();
    }

return(
    <Header >
        <div className="logo">
        <span style={{color:'white'}}><IoHome/> EMAPAG</span>
        </div>
        <div style={{float: 'right'}}>
        <span style={{color:'white'}}><IoPerson/> {usuario.usuarioDisplay}</span>
        <Button type='text' size='small' style={{color:'white', marginLeft: '5px'}} onClick={() => handleLogout()}><IoExit/></Button>
        </div>
    </Header>
    
);
}
export default Cabecera;