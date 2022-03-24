import { ALL_ACTIVOS_USUARIO,
         ALL_ACTIVOS_USUARIO_FAIL,
         ALL_ACTAS_USUARIO,
         ACTA_USUARIO,
         NEW_ACTA,
         CREATE_ACTA,
         CREATE_DETALLE_ACTA,
         DELETE_DETALLE_ACTA
} from '../constants/custodioConstants'

const initialState = {
    activosUsuario: [],
    actaUsuario: {}
}

export const custodioReducer = (state = initialState, action ) => {
    switch(action.type) {
        case ALL_ACTIVOS_USUARIO:
            return{
                ...state,
                activosUsuario: action.payload
            }
        case ALL_ACTAS_USUARIO:
            return {
                ...state,
                actasUsuario: action.payload
            }
        case ACTA_USUARIO:
            return {
                ...state,
                actaUsuario: action.payload,
                success: false
            }
        case NEW_ACTA:
            return {
                ...state,
                actaUsuario: {},
                success: false
            }
        case CREATE_ACTA:
            return {
                ...state,
                actaUsuario: action.payload,
                success: true
            }
        case CREATE_DETALLE_ACTA:
                return {
                    ...state,
                    actaUsuario: 
                        {...state.actaUsuario, 
                    detalle: [...state.actaUsuario.detalle, action.payload]},
                }
        case DELETE_DETALLE_ACTA:
                return {
                    ...state,
                    actaUsuario: 
                        {...state.actaUsuario, 
                    detalle: [...state.actaUsuario.detalle.filter(i => i.actadetId != action.payload)]},
                }
         default:
            return state;
    }

}