const servidorAPI = `${process.env.REACT_APP_API_URL}`;
const logeado = JSON.parse(window.localStorage.getItem('sesionUsuario'));

const header ={
    'Authorization': `Bearer ${logeado?.token}`,
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

export const updateSolicitudCambioEstado = async (payload) =>{
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

export const areaDetalleSolicitudCambioEstado = async (payload) =>{
    let {actaAnio, actaId, areaId, todos, actadetId, acta, area} = payload
    let response  = await fetch(`${servidorAPI}gestionCustodio/areaDetalleSolicitudCambioEstado/${actadetId}/${actaAnio}/${actaId}/${areaId}/${todos}`, {method: "put", headers: header});
    const data = await response.json();
    if (response.status === 200){
        if (todos) {
            console.log('payload todos',payload);
            for (let i = 0; i < acta.detalle.length; i++){
                acta.detalle[i].areaId = areaId
                acta.detalle[i].area = {descripcion: area}
                //acta.detalle[i] = {...acta.detalle[i], areaId: areaId, area:{descripcion: area}}
            }
        }else{
            console.log('payload buscar',payload);
            // let i = acta.detalle.findIndex(i => i.actadetId === actadetId)
            // console.log('index', i);
            // acta.detalle[i].areaId = areaId
            // acta.detalle[i].area = {descripcion: area}
            // acta.detalle.find((item, i) => {
            //     if (item.actadetId === actadetId){
            //         console.log('encuentra',item, i);
            //         acta.detalle[i] = {...acta.detalle[i], areaId: areaId, area:{descripcion: area}}
            //         return true;
            //     }
            // })
            for (let i = 0; i < acta.detalle.length; i++){
                if (acta.detalle[i].actadetId === actadetId){
                    acta.detalle[i].areaId = areaId
                    acta.detalle[i].area = {descripcion:  area}
                }
                //acta.detalle[i] = {...acta.detalle[i], areaId: areaId, area:{descripcion: area}}
            }            
       }
       return acta.detalle;
    }else{
        throw new Error (`[${data.error}]`)
    }
}

export const apruebaSolicitudCambioEstado = async (actaAnio, actaId, usuario) => {
    const response = await fetch(`${servidorAPI}gestionCustodio/actas/aprueba/${actaAnio}/${actaId}/${usuario}`, {method: 'GET'});
    const data = await response.json();
    if (response.status === 200){
        console.log('actas', data)
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

export const getActasCustodioAdministrativo = async (usuario, filtro) => {
    let response = await fetch(`${servidorAPI}gestionCustodio/actas/administrativo/${usuario}?filtro=${encodeURI(JSON.stringify(filtro))}`)
    const data = await response.json();
    if (response.status === 200){
        return data;
    }else{
        throw new Error (`[${data.error}]`)                    
    }            
}

export const getAreas = async (direccionId) => {
    let response = await fetch(`${servidorAPI}gestionCustodio/areas/${direccionId}`, {method: 'GET'});
    const data = await response.json();
    if (response.status === 200){
        return data;
    }else{
        throw new Error (`[${data.error}]`)                    
    }            
}


