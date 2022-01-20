import React, {useState, useContext} from 'react';
import {Modal, AutoComplete, Spin, Input} from 'antd'
import { IoPersonOutline, IoExitOutline, } from 'react-icons/io5'
import { HiOutlineOfficeBuilding } from 'react-icons/hi';
import UserContext from "../../../contexts/userContext"

function ModalBusquedaPerson(props) {

    //const servidorAPI = process.env.REACT_APP_API_URL;

    const servidorAPI = `${process.env.REACT_APP_API_URL}correspondencia/`;
    const [personasFiltradas, setPersonasFiltradas]=useState([]);
    const [value, setValue] = useState();
    const {apiHeader} = useContext(UserContext);    




    // const seleccionarEmpleado = async (value, options) => {
    //     setValor('');
    //     setOpciones([]);
    //     props.onClose(false, options.data);
    // }

    const buscarPersona = async (buscar) =>{
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
                    setPersonasFiltradas(options);
                }
            });
    }


    const seleccionarPersona = async (value, options) => {
        setValue(null);
        setPersonasFiltradas([]);
        props.onClose(false, options.data);
    }


    return (
        <Modal
            title="Buscar Persona"
            visible={props.show}
            onCancel={() => props.onClose(false, null)}
            width={800}
            footer={null}
            style={{top:20}}
        >
        <AutoComplete
        autoFocus={true}
        onSearch={buscarPersona}
        options={personasFiltradas}
        notFoundContent={<Spin/>}
        onSelect={(value, options) => seleccionarPersona(value, options)}
        style={{width: "100%"}}
        value={value}
        onChange={(value) => setValue(value)}
        // disabled={!nuevaSumilla}
        >
            <Input prefix={<IoPersonOutline></IoPersonOutline>}></Input>
        </AutoComplete>
        </Modal>
    );
}

export default ModalBusquedaPerson;