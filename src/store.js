import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from "redux-thunk";
import { custodioReducer } from './modulos/activosFijos/reducers/custodioReducer'
import { composeWithDevTools } from "redux-devtools-extension";

// let initialState = {
//     activosUsuario: null
// }

const middleware = [thunk];

const reducer = combineReducers({
    custodio: custodioReducer
})


const store = createStore(reducer, composeWithDevTools(applyMiddleware(...middleware)));
console.log('store', store);
export default store;