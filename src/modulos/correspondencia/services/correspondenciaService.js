//const servidorAPI = `${process.env.REACT_APP_API_URL}reserva/`;
const servidorAPI = `${process.env.REACT_APP_API_URL}`;
const logeado = JSON.parse(window.localStorage.getItem('sesionUsuario'));

export const getTipoOficios = async (direccionId, apiHeader) => {
    console.log('services logeado', logeado);
    const response = await fetch(`${servidorAPI}reserva/tipoOficio/ByDireccion/${direccionId}`, {method: 'GET', headers: apiHeader});
    const data = await response.json();
    if (response.status === 200){
        return data;
    }else{
        throw new Error (`[${data.error}]`)                    
    }            

}

export const getOficioById = async (id, apiHeader) => {
    console.log('services logeado', logeado);
    const response = await fetch(`${servidorAPI}correspondencia/oficio/${id}`, {method:'GET', headers: apiHeader});
    const data = (await response.json());
    if (response.status === 200){
        return data
    }else{
        throw new Error (`[${data.error}]`)                    
    }            

}

export const getTipoOficiosActivos = async () => {
    
}

export const getReservas = async (direccionId, filtro, pagina, apiHeader) => {
    filtro = `pagina=${pagina}&${filtro}` 

    const response = await fetch(`${servidorAPI}reserva/${direccionId}/?${filtro}`, {method: 'GET', headers: apiHeader});
    const data = (await response.json());
    if (response.status === 200){
        return {data : data.data, totalRows: data.totalRows}
        //setLista(data.data);
        //setTotalRows(data.totalRows);
    }else{
        throw new Error (`[${data.error}]`)                    
    }            
}

export const createReserva = async (payload, apiHeader) =>{
    let response  = await fetch(`${servidorAPI}reserva/createReserva`, {method: "post", headers: apiHeader, body: JSON.stringify(payload)});
    const data = await response.json();
    if (response.status === 201){
        //console.log('si envia', payload);
        return data;
    }else{
        throw new Error (`[${data.error}]`)
    }
}

export const updateReserva = async (payload, apiHeader) => {
    let response = await fetch(`${servidorAPI}reserva/updateReserva/${payload.numeroOficio}`, {method: "put", headers: apiHeader, body: JSON.stringify(payload)});
    const data = await response.json();
    if (response.status === 200){
        //console.log('si envia', payload);
        return data;
    }else{
        throw new Error (`[${data.error}]`)
    }
}



