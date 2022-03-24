import {ALL_ACTIVOS_USUARIO_FAIL, 
        ALL_ACTIVOS_USUARIO,
        ALL_ACTAS_USUARIO,
        ACTA_USUARIO,
        NEW_ACTA,
        CREATE_ACTA,
        CREATE_DETALLE_ACTA,
        DELETE_DETALLE_ACTA
       } 
        from '../constants/custodioConstants'
import { getActivosUsuario, 
         getActasUsuario, 
         getSolicitudCambioCustodio, 
         createSolicitudCambioEstado as createSolicitud,
         createDetalleSolicitudCambioEstado as createDetalleSolicitud,
         deleteDetalleSolicitudCambioEstado as deleteDetalleSolicitud,
         
        } from '../services/custodioServices'

export const getActivosCustodio = (personaId) => async (dispatch) =>{
    try{
         const data = await getActivosUsuario(personaId);
        dispatch({type: ALL_ACTIVOS_USUARIO, payload: data})
    }catch(err){
        dispatch({type: ALL_ACTIVOS_USUARIO_FAIL, payload: err})
    }
}

export const getActasCustodio = (personaId, paginacion) => async dispatch =>  {
    //try {
        const data = await getActasUsuario(personaId, paginacion);
        dispatch({type: ALL_ACTAS_USUARIO, payload: data})
    //} catch (error) {
        
    //}
}

export const getActaCambioCustodio = (anio, actaId) => async dispatch => {
    const data = await getSolicitudCambioCustodio(anio, actaId);
    dispatch({type: ACTA_USUARIO, payload: data});
}

export const createNewSolicitud = () => async dispatch => {
    dispatch ({type: NEW_ACTA});
}

export const createSolicitudCambioEstado = (solicitud) => async dispatch => {
    const data = await createSolicitud(solicitud);
    dispatch({type: CREATE_ACTA, payload: data});
}

export const createDetalleSolicitudCambioEstado = (detalle) => async dispatch => {
    const data = await createDetalleSolicitud(detalle);
    dispatch({type: CREATE_DETALLE_ACTA, payload: {...data, activo: detalle.activo}});
}

export const deleteDetalleSolicitudCambioEstado = (id) => async dispatch => {
    const data = await deleteDetalleSolicitud(id);
    dispatch({type: DELETE_DETALLE_ACTA, payload: id});
}


// export const getActivosCustodio = (dispatch) =>{
//     console.log('dispatch', dispatch);
//     return { type: ALL_ACTIVOS_USUARIO, payload: {id:5} }
// };

