const servidorAPI = `${process.env.REACT_APP_API_URL}seguridad/`;

export const getOpcionesByUsuario = async (usuario, apiHeader) =>{
    const response = await fetch(`${servidorAPI}opcionesUsuario/${usuario}`, {method: 'GET', headers: apiHeader});
    const data = await response.json();
    if (response.status === 200){
        return data;
    }else{
        throw new Error (`[${data.error}]`)                    
    }            

}

export const getModulosByUsuario = async (usuario, apiHeader) => {
    const response = await fetch(`${servidorAPI}modulosUsuario/${usuario}`, {method: 'GET', headers: apiHeader});
    const data = await response.json();
    if (response.status === 200){
        return data;
    }else{
        throw new Error (`[${data.error}]`)                    
    }            
}