import { ALL_ACTIVOS_USUARIO,
         REQUESTING,
         ALL_ACTAS_USUARIO,
         REQUESTING_DETAIL,
         ACTA_USUARIO,
         NEW_ACTA,
         CREATE_ACTA,
         UPDATE_ACTA,
         CREATE_DETALLE_ACTA,
         DELETE_DETALLE_ACTA,
         AREA_DETALLE_ACTA,
         APRUEBA_ACTA,
         REQUESTING_APRUEBA,
         APRUEBA_SUCCESS,
         ALL_ACTAS_CUSTODIO_ADMINISTRATIVO
} from '../constants/custodioConstants'

const initialState = {
    activosUsuario: [],
    actaUsuario: {},
    actasAdministrativo: []
}

export const custodioReducer = (state = initialState, action ) => {
    switch(action.type) {
        case REQUESTING:
            return{
                ...state,
                loadingAprueba: false,
                loading: true,
            }
        case REQUESTING_DETAIL:
                return{
                    ...state,
                    loading: false,
                    loadingDetail: true
                }
        case ALL_ACTIVOS_USUARIO:
            return{
                ...state,
                loading: false,
                activosUsuario: action.payload
            }
        case ALL_ACTAS_USUARIO:
            return {
                ...state,
                loading: false,
                actasUsuario: action.payload
            }
        case ACTA_USUARIO:
            return {
                ...state,
                loading: false,
                actaUsuario: action.payload,
                success: false
            }
        case NEW_ACTA:
            return {
                ...state,
                loading: false,
                actaUsuario: {},
                success: false
            }
        case CREATE_ACTA:
            return {
                ...state,
                loading: false,
                actaUsuario: action.payload,
                success: true
            }
        case UPDATE_ACTA:
            return {
                ...state,
                loading: false,
                success: false
            }
        case CREATE_DETALLE_ACTA:
                return {
                    ...state,
                    loading: false,
                    loadingDetail: false,
                    actaUsuario: 
                        {...state.actaUsuario, 
                    detalle: [...state.actaUsuario.detalle, action.payload]},
                }
        case DELETE_DETALLE_ACTA:
                return {
                    ...state,
                    loading: false,
                    loadingDetail: false,
                    actaUsuario: 
                        {...state.actaUsuario, 
                    detalle: [...state.actaUsuario.detalle.filter(i => i.actadetId != action.payload)]},
                }
        case AREA_DETALLE_ACTA:
            return {
                ...state,
                loading: false,
                loadingDetail: false,
                actaUsuario : {...state.actaUsuario, detalle: action.payload}
            }
        case REQUESTING_APRUEBA:
            return{
                ...state,
                loading: false,
                loadingAprueba: true
            }
        case APRUEBA_ACTA:
            return {
                ...state,
                loading: false,
                loadingAprueba: false,
                apruebaSuccess:true,
            }
        case APRUEBA_SUCCESS:
            return {
                ...state,
                loading: false,
                loadingAprueba: false,
                apruebaSuccess:true
            }
        case ALL_ACTAS_CUSTODIO_ADMINISTRATIVO:
            return {
                ...state,
                loading: false,
                actasAdministrativo: action.payload
            }
        default:
            return state;
    }

}