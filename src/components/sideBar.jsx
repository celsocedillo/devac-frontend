import React, { useContext, useEffect, useState} from 'react';
import { Link } from "react-router-dom";
import { Layout, Menu } from 'antd';
import UserContext from '../contexts/userContext';
import { Fragment } from 'react';
import { IoMailOutline, IoFileTrayFullOutline, IoCaretForwardOutline, IoGrid } from 'react-icons/io5'
import { getOpcionesByUsuario } from '../pages/seguridad/services/seguridad.services'

const {Sider} = Layout;
const { SubMenu } = Menu;
require('dotenv').config();


const Sidebar  = () => {

    //const [openKeys, setOpenKeys] = useState(['sub1']);
    const [opciones, setOpciones] = useState([]);
    const [opcMenu, setOpcMenu] = useState([]);
    const {usuario, modulo, apiHeader} = useContext(UserContext);

useEffect(()=>{
    if (usuario && modulo){
        setOpcMenu([]);
        getOpcionesByUsuario(usuario.usuario, apiHeader).then((data)=>{
            setOpciones(data);   
            armaMenu(data);
        });

        return() =>{
            //Esto es parte de limpieza del menu
            setOpcMenu([]);
        }
    }

},[usuario, modulo])


const armaMenu = async data => {
    let r = []
    //Empieza seleccionando los menus principales 
    data.filter(  item => item.tipo === 'N').map( async menu => {
        const x = await retornaHijos((data.filter(i => i.padreId === menu.menuId)), data)
        const g = opcMenu
        g.push(<SubMenu icon={<IoGrid></IoGrid>} key={menu.id} title={menu.labelMenu}>{x}</SubMenu>)
        setOpcMenu(g)
    })
}

const retornaHijos = async (hijos, menuCompleto) => {
    let x = [];
    hijos.map(async item => {
        //Si el hijo es una opción final
        if (item.tipo === 'F'){
            x.push(<Menu.Item key={item.id} >
                        <Link to={`/${item.forma}`}>{item.labelMenu}</Link>
                    </Menu.Item>);
        }
        //Si el hijo es un subemnu, ingresa a otro bucle para buscar las opciones internas
        if (item.tipo === 'S'){
            const l = await retornaHijos(menuCompleto.filter(x => x.padreId === item.menuId), menuCompleto)
            console.log('hijos sub', l);
            x.push(<SubMenu icon={<IoGrid></IoGrid>} key={item.id} title={item.labelMenu}>{l}</SubMenu>)
        }
    })
    return x
}





return (
    <Fragment>
        {
            (usuario && modulo) && 

            <Sider width={200} collapsible theme='dark'>
                {/* <Menu
                    title='Correspondencia'
                    mode='inline'

                    defaultOpenKeys={['sub1']}
                    theme='dark'
                >
                    <SubMenu key="sub1" title="Bandejas" icon={<IoMailOutline/>}>
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
                                <Menu.Item key='4' icon={<IoFileTrayFullOutline/>}>
                                    <Link to='/correspondencia/reservas'>Reservas de oficio</Link>
                                </Menu.Item>

                            </Fragment>
                        :
                        <Fragment>
                            <Menu.Item key='1' icon={<IoFileTrayFullOutline/>}>
                                <Link to='/correspondencia/bandejaSumillas'>BandejaSumillas</Link>
                            </Menu.Item>
                            <Menu.Item key='2' icon={<IoFileTrayFullOutline/>}>
                                <Link to='/correspondencia/reservas'>Reservas de oficio</Link>
                            </Menu.Item>
                        </Fragment>

                        }
                    </SubMenu>
                </Menu> */}

                {(usuario && modulo) &&
                    <Menu
                        title='Ejemplo'
                        mode='inline'
                        defaultOpenKeys={['sub2']}
                        theme='dark'
                    >
                        {opcMenu}
                    </Menu>
                }

            </Sider>
        }

        
    </Fragment>
  
)
}
export default Sidebar;