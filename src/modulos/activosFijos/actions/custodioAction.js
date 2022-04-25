import {
        REQUESTING,
        REQUESTING_DETAIL,
        ALL_ACTIVOS_USUARIO_FAIL, 
        ALL_ACTIVOS_USUARIO,
        ALL_ACTAS_USUARIO,
        ACTA_USUARIO,
        NEW_ACTA,
        CREATE_ACTA,
        UPDATE_ACTA,
        CREATE_DETALLE_ACTA,
        DELETE_DETALLE_ACTA,
        AREA_DETALLE_ACTA,
        APRUEBA_ACTA,
        REQUESTING_APRUEBA,
        ALL_ACTAS_CUSTODIO_ADMINISTRATIVO,
       } 
        from '../constants/custodioConstants'
import { getActivosUsuario, 
         getActasUsuario, 
         getSolicitudCambioCustodio, 
         createSolicitudCambioEstado as createSolicitud,
         updateSolicitudCambioEstado as updateSolicitud,
         createDetalleSolicitudCambioEstado as createDetalleSolicitud,
         deleteDetalleSolicitudCambioEstado as deleteDetalleSolicitud,
         areaDetalleSolicitudCambioEstado as areaDetalleSolicitud,
         getActasCustodioAdministrativo as getActasAdministrativo,
         apruebaSolicitudCambioEstado as apruebaSolicitud  
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
        dispatch({type: REQUESTING })
        const data = await getActasUsuario(personaId, paginacion);
        dispatch({type: ALL_ACTAS_USUARIO, payload: data})
    //} catch (error) {
        
    //}
}

export const getActaCambioCustodio = (anio, actaId) => async dispatch => {
    dispatch({type: REQUESTING })
    const data = await getSolicitudCambioCustodio(anio, actaId);
    dispatch({type: ACTA_USUARIO, payload: data});
}

export const createNewSolicitud = () => async dispatch => {
    dispatch ({type: NEW_ACTA});
}

export const createSolicitudCambioEstado = (solicitud) => async dispatch => {
    dispatch({type: REQUESTING })
    const data = await createSolicitud(solicitud);
    dispatch({type: CREATE_ACTA, payload: data});
}

export const updateSolicitudCambioEstado = (solicitud) => async dispatch => {
    dispatch({type: REQUESTING })
    const data = await updateSolicitud(solicitud);
    dispatch({type: UPDATE_ACTA, payload: data});
}

export const createDetalleSolicitudCambioEstado = (detalle) => async dispatch => {
    dispatch({type: REQUESTING_DETAIL })
    const data = await createDetalleSolicitud(detalle);
    dispatch({type: CREATE_DETALLE_ACTA, payload: {...data, activo: detalle.activo}});
}

export const deleteDetalleSolicitudCambioEstado = (id) => async dispatch => {
    dispatch({type: REQUESTING_DETAIL })
    const data = await deleteDetalleSolicitud(id);
    dispatch({type: DELETE_DETALLE_ACTA, payload: id});
}

export const areaDetalleSolicitudCambioEstado = (payload) => async dispatch => {
    dispatch({type: REQUESTING_DETAIL })
    const data = await areaDetalleSolicitud(payload);
    dispatch({type: AREA_DETALLE_ACTA, payload: data});
}

export const apruebaActaSolicitudCambioEstado = (actaAnio, actaId, usuario) => async dispatch => {
    dispatch({type: REQUESTING_APRUEBA })
    const data = await apruebaSolicitud(actaAnio, actaId, usuario)
    dispatch({type: APRUEBA_ACTA, payload: data});
}

export const getActasCustodioAdministrativo = (usuario, paginacion) => async dispatch => {
    dispatch({type: REQUESTING })
    const data = await getActasAdministrativo(usuario, paginacion);
    dispatch({type: ALL_ACTAS_CUSTODIO_ADMINISTRATIVO, payload: data})
}
// export const getActivosCustodio = (dispatch) =>{
//     console.log('dispatch', dispatch);
//     return { type: ALL_ACTIVOS_USUARIO, payload: {id:5} }
// };

