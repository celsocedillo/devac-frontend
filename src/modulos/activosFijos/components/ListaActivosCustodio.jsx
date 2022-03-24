import React, {useState, useEffect, useContext, Fragment} from "react"
import { getActivosUsuario } from '../services/custodioServices'
import UserContext from '../../../contexts/userContext'
import { Button, Table } from "antd";
import Modal from "antd/lib/modal/Modal";

const ListaActivosCustodio = (props) => {

    const [listaActivos, setListaActivos] = useState();
    const [selectedRows, setSelectedRows] = useState([]);
    const {usuario}  =  useContext(UserContext)
    const { Column } = Table;
    console.log('activos q vienen', props.activosExistentes)

    useEffect(()=>{
        console.log('efecto');
        setSelectedRows([]);
        async function carga() {
            const lista = usuario && await getActivosUsuario(usuario?.codigo);
            setListaActivos(lista?.filter(i => !props.activosExistentes?.includes(i.activoId)));
        }
        carga();
    }, [usuario, props.show]);

    const selected = selectedRows => {
        console.log(selectedRows);
    }

    const addSelected = () =>{
       const t= [];
       if (selectedRows.length > 0){
        selectedRows.map(i => listaActivos.filter(j => j.custodioId == i).map(p => t.push(p)))
       }
       props.onClose(false, t); 
    }

   
    return (
        
        <Modal
            title="Buscar activos"
            visible={props.show}
            //setShowListaActivos
            onCancel={() => props.onClose(false, [])}
            onOk={() => addSelected()}
            okText="Agregar"
            cancelText="Cancelar"
            width={900}
            style={{top:20}}
        >
        {
            listaActivos && 
            <>
            <Table
                dataSource={listaActivos} 
                size="small" 
                rowKey="custodioId" 
                pagination={false}
                selected
                //rowSelection={{setSelectedRows: selectedRows, onChange: selected }}
                rowSelection={{selectedRowKeys: selectedRows, onChange: (selectedRowKeys)=> setSelectedRows(selectedRowKeys)}}
                scroll={{y: 600 }}
                footer={() => <span style={{fontWeight: 'bold' }}>Nro. de registros {listaActivos?.length}</span>}    
            >
                <Column title="CodEmapag"  key="codigoEcapag" width={80} 
                    sorter={
                         ((a,b)=> a.activo.codigoEcapag?.localeCompare(b.activo.codigoEcapag))
                        }
                    render={rowData => rowData?.activo?.codigoEcapag}
                />
                <Column title="CodControl"  key="codigoActivoControl" width={70} 
                    render={rowData => rowData?.activo?.codigoActivoControl}
                />
                <Column title="Tipo"  key="tipoActivo" width={180} 
                    sorter={(a,b) => a.activo?.tipoActivo?.localeCompare(b.activo.tipoActivo) }
                    render={rowData => rowData?.activo?.tipoActivo}
                />
                <Column title="Clase"  key="claseActivo" width={180} 
                    sorter={(c,d) => c.activo?.claseActivo?.localeCompare(d.activo.claseActivo) }
                    render={rowData => rowData?.activo?.claseActivo}
                />
                <Column title="Activo"  key="activoId"  
                    render={rowData => rowData?.activo?.descripcion}
                />
            </Table>
            {/* <Button onClick={() => addSelected()}>boton</Button> */}
            </>
        }
        </Modal>
    );
}

export default ListaActivosCustodio;