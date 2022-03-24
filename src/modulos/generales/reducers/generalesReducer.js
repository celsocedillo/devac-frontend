import { EMPLEADOS_FILTRO } from '../constants/generalesConstants'

export const generalesReducer = (state = initialState, action ) => {
    switch(action.type) {
        case EMPLEADOS_FILTRO:
            return{
                ...state,
                empleadosFiltro: action.payload
            }
        default:
            return state;
    }

}