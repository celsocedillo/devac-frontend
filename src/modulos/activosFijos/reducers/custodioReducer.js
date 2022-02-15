import { ALL_ACTIVOS_USUARIO,
         ALL_ACTIVOS_USUARIO_FAIL,
         ALL_ORDERS_USUARIO
} from '../constants/custodioConstants'

const initialState = {
    activosUsuario: []
}

export const custodioReducer = (state = initialState, action ) => {
    console.log('reducer', state);
    console.log('lisactions', action);
    switch(action.type) {
        case ALL_ACTIVOS_USUARIO:
            console.log('action __')
            return{
                ...state,
                activosUsuario: action.payload
            }
        default:
            return state;
    }

}