import React, {useState, useContext} from 'react';
import { Link, useHistory } from "react-router-dom";
import { Layout, Menu } from 'antd';
import { IoHomeOutline, IoPersonOutline  } from 'react-icons/io5'
import SubMenu from 'antd/lib/menu/SubMenu';
import UserContext from '../../contexts/userContext';

const {Sider} = Layout;
require('dotenv').config();


const Sidebar  = () => {

    console.log('V Sidebar')

    const [openKeys, setOpenKeys] = useState(['sub1']);
    const {usuario} = useContext(UserContext);
    let history = useHistory();

const handleMenu = e => {
    console.log('click sidebar', e);
    if (e.key === '1'){
        history.push('/enEspera');
    }else if (e.key === '2'){
        history.push('/oficios');
    }

}

const handleOpenChange = () => {
    setOpenKeys(['sub1']);
}


return (
        <Sider width={200} collapsible theme='dark'>
            <Menu
                title='Correspondencia'
                mode='inline'
                defaultSelectedKeys={['1']}
                onClick={handleMenu}
                onOpenChange={handleOpenChange}
                theme='dark'
            >
                <Menu.Item key='1'>Sumillas en espera</Menu.Item>
                {
                    usuario.direccionId === parseInt(process.env.REACT_APP_GERENCIA_DIRECCION_ID) &&
                    <Menu.Item key='2'>Lista de oficios</Menu.Item>
                }
                
            </Menu>
        </Sider>
  
)
}
export default Sidebar;