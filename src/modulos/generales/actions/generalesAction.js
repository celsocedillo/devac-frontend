import { EMPLEADOS_FILTRO} from '../constants/generalesConstants'
import { getEmpleadoByFiltroService as getEmpleadoByFiltro } from '../services/generalesServices'


export const getEmpleadosByFiltro = (filtro) => async (dispatch) =>{
    try{
         const data = await getEmpleadoByFiltroService(filtro);
        dispatch({type: EMPLEADOS_FILTRO, payload: data})
    }catch(err){
        dispatch({type: ALL_ACTIVOS_USUARIO_FAIL, payload: err})
    }
}
