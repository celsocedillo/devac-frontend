import React, {useState, useContext} from 'react';
import {Modal, AutoComplete, Spin, Input} from 'antd'
import { IoPersonOutline, IoExitOutline, IoMailOutline, IoPersonCircleOutline,  IoArrowBackOutline } from 'react-icons/io5'
import { HiOutlineOfficeBuilding } from 'react-icons/hi';
import UserContext from "../../../contexts/userContext"

function AutoCompBusquedaPersona(props){
    const servidorAPI = `${process.env.REACT_APP_API_URL}correspondencia/`;
    const [clientesFiltrados, setClientesFiltrados]=useState([]);
    const {usuario, apiHeader} = useContext(UserContext);    


    const buscarCliente = async (buscar) =>{
        await fetch(
            `${servidorAPI}filtroUsuarios/` + buscar.toUpperCase(),  {method: 'GET', headers: apiHeader})
            .then(async response => {
                let resultado = await response.json();
                if (response.status === 200){
                    let options = await resultado.map(item => ({
                    key: `${item.tipo}${item.id}`,
                    value: `${item.empleado}`, 
                    label:
                    <div>
                        {item.tipo === 'I' ? <div><IoPersonOutline style={{color:"#faad14"}}/>{item.empleado}</div>
                        :<div><IoExitOutline style={{color:"purple"}}/>{item.empleado} </div>}
                        <HiOutlineOfficeBuilding/>{item.departamento}
                    </div>
                    ,
                    data: item}));
                    console.log(options);
                    setClientesFiltrados(options);
                }
            });
    }




    const seleccionarEmpleado = async (value, options) => {

        setClientesFiltrados([]);
        props.onSeleccionEmpleado(options.data);
    }

    return(
        <AutoComplete
        autoFocus={true}
        onSearch={buscarCliente}
        options={clientesFiltrados}
        notFoundContent={<Spin/>}
        onSelect={(value, options) => seleccionarEmpleado(value, options)}
        style={{width: "100%"}}
        // disabled={!nuevaSumilla}
        >
        <Input prefix={<IoPersonOutline></IoPersonOutline>}></Input>
        </AutoComplete>
);

}

export default AutoCompBusquedaPersona;