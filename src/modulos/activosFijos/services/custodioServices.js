const servidorAPI = `${process.env.REACT_APP_API_URL}`;

export const getActivosUsuario = async (personaId, apiHeader) => {
    //const response = await fetch(`${servidorAPI}gestionCustodio/activosUsuario/${personaId}`, {method: 'GET', headers: apiHeader});
    const response = await fetch(`${servidorAPI}gestionCustodio/activosUsuario/${personaId}`, {method: 'GET'});
    const data = await response.json();
    if (response.status === 200){
        return data;
    }else{
        throw new Error (`[${data.error}]`)                    
    }            

}
