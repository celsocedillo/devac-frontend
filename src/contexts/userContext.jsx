import React, { createContext, useEffect, useState } from 'react';
import { notification } from 'antd';

const UserContext = createContext();

const UserProvider = ({ children }) => {

    const [usuario, setUsuario] = useState(null)
    const [apiHeader, setApiHeader] = useState(null);
    const [modulo, setModulo] = useState(null);
    const servidorAPISEG = process.env.REACT_APP_API_URL;
    

    useEffect(() => {
        const readLocal = async() => {
            const logeado = JSON.parse(window.localStorage.getItem('sesionUsuario'));
            if (logeado){

                setApiHeader({
                    'Authorization': `Bearer ${logeado.token}`,
                    'Content-Type': 'application/json'
                });                    
                const response = await fetch(`${servidorAPISEG}seguridad/infoUsuario/${logeado.usuario}`, {method: 'GET', headers: {
                    'Authorization': `Bearer ${logeado.token}`,
                    'Content-Type': 'application/json'
                }});
                const data = (await response.json());
                if (response.status === 201){
                    setUsuario(data.data);
                    setApiHeader({
                        'Authorization': `Bearer ${logeado.token}`,
                        'Content-Type': 'application/json'
                    });                    
                }else if (response.status === 503){
                    //Token caducado
                    window.localStorage.removeItem('sesionUsuario');
                    window.localStorage.removeItem('sesionModulo');
                    setUsuario(null);
                    setModulo(null);
                }else{
                    throw new Error (`[${data.error}]`)                    
                }      
                window.localStorage.getItem('sesionModulo') && setModulo(JSON.parse(window.localStorage.getItem('sesionModulo')));     
            }
        }
        readLocal()    
    },[])

    async function login(puser, ppassword) {
        try {
            const response = await fetch(`${servidorAPISEG}login/${puser}/${ppassword}`);
            const data = (await response.json());
            if (response.status === 201){
                setUsuario(data.data.usuario);
                setApiHeader({
                    'Authorization': `Bearer ${data.data.token}`,
                    'Content-Type': 'application/json'
                });
                window.localStorage.setItem('sesionUsuario', JSON.stringify({usuario: data.data.usuario.usuario, token: data.data.token}))
                return data.data.usuario
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
        setUsuario(null);
        setModulo(null);
    }

    const data = { usuario, apiHeader, login, logout, setUsuario, modulo, setModulo }

    return (
        <UserContext.Provider value={data}>
            {children}
        </UserContext.Provider>
    )
}

export { UserProvider }
export default UserContext;