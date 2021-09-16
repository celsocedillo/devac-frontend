import React, { useContext} from 'react';
import { Link, useHistory } from "react-router-dom";
import { Layout, Menu } from 'antd';
import UserContext from '../contexts/userContext';
import { Fragment } from 'react';
import { IoMailOutline, IoFileTrayFullOutline } from 'react-icons/io5'


const {Sider} = Layout;
const { SubMenu } = Menu;
require('dotenv').config();


const Sidebar  = () => {

    //const [openKeys, setOpenKeys] = useState(['sub1']);

    const {usuario, modulo} = useContext(UserContext);
    let history = useHistory();

const handleMenu = (e, key) => {
    if (key === '1'){
        history.push('/correspondencia/espera');
    }else if (key === '2'){
        history.push('/correspondencia/oficios');
    }
    //console.log('open', openKeys);
   //e.stopPropagation();
}

// const handleOpen = (e) => {
//     e && setOpenKeys(e.filter(e => !e==openKeys ),'sub1');
// }


return (
    <Fragment>
        {
            (usuario && modulo) && 

            <Sider width={200} collapsible theme='dark'>
                <Menu
                    title='Correspondencia'
                    mode='inline'
                    //defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    onClick={({e, key}) => {handleMenu( e, key); } }
                    //openKeys={openKeys}
                    //onOpenChange={handleOpen}
                    theme='dark'
                    //inlineCollapsed={true}
                >
                    <SubMenu key="sub1" title="Bandejas" icon={<IoMailOutline/>}>
                        {/* <Menu.Item key='1' icon={<IoFileTrayFullOutline/>}>Sumillas en espera</Menu.Item> */}
                        {usuario.usuarioSecretaria
                        ?
                            <Fragment>
                                <Menu.Item key='1' icon={<IoFileTrayFullOutline/>}>
                                    <Link to='/correspondencia/espera'>Sumillas en espera</Link>
                                    
                                </Menu.Item>
                                <Menu.Item key='2' icon={<IoFileTrayFullOutline/>}>
                                    <Link to='/correspondencia/oficios'>Oficios</Link>
                                    
                                </Menu.Item>
                                <Menu.Item key='3' icon={<IoFileTrayFullOutline/>}>
                                    <Link to='/correspondencia/bandejaSumillas'>BandejaSumillas</Link>
                                </Menu.Item>

                            </Fragment>
                        :
                        <Menu.Item key='3' icon={<IoFileTrayFullOutline/>}>
                            <Link to='/correspondencia/bandejaSumillas'>BandejaSumillas</Link>
                            
                        </Menu.Item>
                        }
                    {/* {
                        usuario?.direccionId === parseInt(process.env.REACT_APP_GERENCIA_DIRECCION_ID) &&
                        <Menu.Item key='2' icon={<IoFileTrayFull/>}>Lista de oficios</Menu.Item>
                    } */}
                    </SubMenu>
                    {/* <SubMenu key="sub2" title="Navigation One">
                        <Menu.Item key="5">Option 5</Menu.Item>
                        <Menu.Item key="6">Option 6</Menu.Item>
                        <Menu.Item key="7">Option 7</Menu.Item>
                        <Menu.Item key="8">Option 8</Menu.Item>
                    </SubMenu> */}
                </Menu>
            </Sider>
        }
    </Fragment>
  
)
}
export default Sidebar;