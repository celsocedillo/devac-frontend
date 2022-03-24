const servidorAPI = `${process.env.REACT_APP_API_URL}`;
const logeado = JSON.parse(window.localStorage.getItem('sesionUsuario'));

const header ={
    'Authorization': `Bearer ${logeado.token}`,
    'Content-Type': 'application/json'
  }                    


export const getActivosUsuario = async (personaId) => {
    const response = await fetch(`${servidorAPI}gestionCustodio/activosUsuario/${personaId}`, {method: 'GET'});
    const data = await response.json();
    if (response.status === 200){
        console.log('listaSer', data);
        return data;
    }else{
        throw new Error (`[${data.error}]`)                    
    }            
}

export const getActasUsuario = async (personaId, paginacion) => {
    const response = await fetch(`${servidorAPI}gestionCustodio/actas/usuario/${personaId}?paginacion=${encodeURI(JSON.stringify(paginacion))}`, {method: 'GET'});
    const data = await response.json();
    if (response.status === 200){
        console.log('actas', data)
        return data;
    }else{
        throw new Error (`[${data.error}]`)                    
    }            
}

export const getSolicitudCambioCustodio = async (anio, actaId) => {
    console.log('action getSolicitudCambioCustodio')
    const response = await fetch(`${servidorAPI}gestionCustodio/acta/${anio}/${actaId}`, {method: 'GET'});
    const data = await response.json();
    if (response.status === 200){
        return data;
    }else{
        throw new Error (`[${data.error}]`)                    
    }            

}

export const createSolicitudCambioEstado = async (payload) =>{
    let response  = await fetch(`${servidorAPI}gestionCustodio/createSolicitudCambioEstado`, {method: "post", headers: header, body: JSON.stringify(payload)});
    const data = await response.json();
    if (response.status === 201){
        return data;
    }else{
        throw new Error (`[${data.error}]`)
    }
}

export const updateSolicitudCambioEstado = async (payload, apiHeader) =>{
    let response  = await fetch(`${servidorAPI}gestionCustodio/updateSolicitudCambioEstado`, {method: "put", headers: header, body: JSON.stringify(payload)});
    const data = await response.json();
    if (response.status === 200){
        return data;
    }else{
        throw new Error (`[${data.error}]`)
    }
}


export const createDetalleSolicitudCambioEstado = async (payload, apiHeader) =>{
    let response  = await fetch(`${servidorAPI}gestionCustodio/createDetalleSolicitudCambioEstado`, {method: "post", headers: header, body: JSON.stringify(payload)});
    const data = await response.json();
    if (response.status === 201){
        return data;
    }else{
        throw new Error (`[${data.error}]`)
    }
}

export const deleteDetalleSolicitudCambioEstado = async (id) =>{
    let response  = await fetch(`${servidorAPI}gestionCustodio/deleteDetalleSolicitudCambioEstado/${id}`, {method: "delete", headers: header});
    const data = await response.json();
    if (response.status === 200){
        return data;
    }else{
        throw new Error (`[${data.error}]`)
    }
}


