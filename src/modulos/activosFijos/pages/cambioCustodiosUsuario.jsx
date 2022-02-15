import React, {useState, useEffect, useRef, useContext}  from "react";
import { useSelector, useDispatch} from 'react-redux'
import { getActivosCustodio } from '../actions/custodioAction'

const ListaCambioCustodioUsuarios = () =>  {
    const state = useSelector( state => state);
    const dispatch = useDispatch();
    //const {activosUsuario} = state.activosUsuario
    console.log('estadoLista', state);

    useEffect(()=>{
        dispatch(getActivosCustodio(18));
    },[dispatch])

    return(
        <div>
            Hola
        </div>
    )
}

export default ListaCambioCustodioUsuarios