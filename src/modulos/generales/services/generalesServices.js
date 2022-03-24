const servidorAPI = `${process.env.REACT_APP_API_URL}`;
const logeado = JSON.parse(window.localStorage.getItem('sesionUsuario'));

const header ={
                'Authorization': `Bearer ${logeado.token}`,
                'Content-Type': 'application/json'
              }                    


export const getEmpleadoByFiltro = async (filtro) => {
        const response = await fetch(`${servidorAPI}generales/empleado/filtro/${filtro}`, {method: 'GET', headers: header});
        const data = await response.json();
        if (response.status === 200){
            return data;
        }else{
            throw new Error (`[${data.error}]`)                    
        }            
}


