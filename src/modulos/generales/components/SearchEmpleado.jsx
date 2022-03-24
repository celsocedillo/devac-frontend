import React, {useState} from 'react';
import { Modal, AutoComplete } from 'antd'
import { getEmpleadoByFiltro } from '../services/generalesServices'

const SearchEmpleado = (props) => {

    const [opciones, setOpciones] = useState([]);
    const [valor, setValor] = useState('');

    const search = async(buscar) => {
        if (buscar){
            const data = await getEmpleadoByFiltro(buscar);
            if (data) {
                let options = data.map(item => ({value: `${item.cedula} - ${item.empleado}`, data: item}))
                setOpciones(options)
            }
        }else{
            setValor('');
            setOpciones([]);   
        }
    }

    const selectEmpleado = async (value, options) => {
        setValor('');
        setOpciones([]);
        props.onClose(false, options.data);
    }

    return (
        <Modal
            title="Buscar Empleado"
            visible={props.show}
            onCancel={() => props.onClose(false, null)}
            width={800}
            footer={null}
            style={{top:20}}
        >
            <AutoComplete
                autoFocus={true}
                onSearch={search}
                options={opciones}
                //notFoundContent={<Spin/>}
                onSelect={(value, options) => selectEmpleado(value, options)}
                value={valor}
                onChange={(valor) =>{ setValor(valor)}  }
                style={{width: "100%"}}
                size='small'
                >
            </AutoComplete>
        </Modal>    
    );
}

export default SearchEmpleado;