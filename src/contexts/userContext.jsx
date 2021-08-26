import React, { createContext, useEffect, useState } from 'react';
import { notification } from 'antd';

const UserContext = createContext();

const UserProvider = ({ children }) => {
    
    const [usuario, setUsuario] = useState(JSON.parse(window.localStorage.getItem('sesionUsuario')) || null)
    const [apiHeader, setApiHeader] = useState({
        'Authorization': `Bearer ${JSON.parse(window.localStorage.getItem('sesionToken'))}`  ,
        'Content-Type': 'application/json'
    } || null);
    //const servidorAPISEG = process.env.REACT_APP_API_URL_SEG;
    const servidorAPISEG = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const readLocal = async  => {
            const logeado = JSON.parse(window.localStorage.getItem('sesionUsuario'));
            if (logeado){
                setUsuario(logeado);
            }
        }
        readLocal()    
    },[])

    const login = async (puser, ppassword) => {
        try {
            console.log('login')
            const response = await fetch(`${servidorAPISEG}login/${puser}/${ppassword}`);
            const data = (await response.json());
            if (response.status === 201){
                setUsuario(data.data.usuario);
                const x= {
                    'Authorization': `Bearer ${data.data.token}`,
                    'Content-Type': 'application/json'
                }
                setApiHeader(x);
                console.log('x1', data.data.usuario);
                console.log('x2', x);
                window.localStorage.setItem('sesionUsuario', JSON.stringify(data.data.usuario));
                window.localStorage.setItem('sesionToken', data.data.token);
                console.log('usuarioCon', usuario);
            }else{
                throw new Error (`[${data.error}]`)                    
            }            
        } catch (error) {
            notification['error']({
                message: 'Error',
                description: `Error en login ${error}`
              });                
        }        
        
    }

    const logout = () => {
        console.log('logout');
        window.localStorage.removeItem('sesionUsuario');
        window.localStorage.removeItem('sesionToken');
        setUsuario(null);
    }

    const data = { usuario, apiHeader, login, logout, setUsuario }

    return (
        <UserContext.Provider value={data}>
            {children}
        </UserContext.Provider>
    )
}

export { UserProvider }
export default UserContext;