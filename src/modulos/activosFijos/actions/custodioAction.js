import {ALL_ACTIVOS_USUARIO_FAIL, ALL_ACTIVOS_USUARIO} from '../constants/custodioConstants'
import { getActivosUsuario} from '../services/custodioServices'

export const getActivosCustodio = (personaId) => async (dispatch) =>{
    try{
        console.log('action');
        const data = await getActivosUsuario(personaId);
        //const data = [{id: 1}]
        //return {type: ALL_ACTIVOS_USUARIO, payload: data}
        dispatch({type: ALL_ACTIVOS_USUARIO, payload: data})
    }catch(err){
        dispatch({type: ALL_ACTIVOS_USUARIO_FAIL, payload: err})
    }
}

// export const getActivosCustodio = (dispatch) =>{
//     console.log('dispatch', dispatch);
//     return { type: ALL_ACTIVOS_USUARIO, payload: {id:5} }
// };

