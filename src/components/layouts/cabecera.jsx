import React from 'react';
import { Layout } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faUser } from '@fortawesome/free-solid-svg-icons'


const {Header} = Layout;

const Cabecera  = () => 
     (
    <Header >
        <div className="logo">
        <span style={{color:'white'}}><FontAwesomeIcon icon={faHome}></FontAwesomeIcon> EMAPAG</span>
        </div>
        <div style={{float: 'right'}}>
        <span style={{color:'white'}}><FontAwesomeIcon icon={faUser}></FontAwesomeIcon> {localStorage.getItem("usuario")}</span>
        </div>
    </Header>
  
  
)

export default Cabecera;