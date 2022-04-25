import React, {useState, useEffect, useRef, useContext}  from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch} from 'react-redux'
import moment from 'moment';
import { Row, Col, Card, Table, Button, notification, Popover, Badge, Input, Form, DatePicker, Space, Select, Tag } from 'antd';
import { getActivosCustodio, getActasCustodio, getActasCustodioAdministrativo } from '../actions/custodioAction'
import { IoAdd, IoInformationCircleOutline, IoCloseCircleOutline, IoCheckmarkCircle, IoPrintOutline  } from 'react-icons/io5';
import UserContext from "../../../contexts/userContext";



const ListaAprobacionCambioCustodio = () =>  {
    const { Column } = Table;
    const [currentPage, setCurrenPage] = useState(1);
    const [elementsNumber, setElementsNumber] = useState(20);
    const { actasAdministrativo, loading } = useSelector( state => state.custodio);
    const {usuario, apiHeader} = useContext(UserContext);
    const dispatch = useDispatch();

    useEffect(()=>{
        usuario && 
            //dispatch(getActivosCustodio(usuario.codigo));
            dispatch(getActasCustodioAdministrativo(usuario.usuario, {pagina: currentPage, numeroElementos: elementsNumber, estado: 'EA'}));
    },[dispatch, usuario ])

    // const handleTableChange = (pagination, filters, sorter) => {
    //     setCurrenPage(pagination.current);
    //     dispatch(getActasCustodio(usuario.codigo, {pagina: pagination.current, numeroElementos: elementsNumber}));
    // };


    return(
        <Card title='Lista de solicitudes de cambio de custodio del area'>
            <Row>
                <Col span={24} style={{backgroundColor: '#efefef'}}>
                {/* <Link to="/activos/solicitudCambio/0/0">
                    <Button size="small" icon={<IoAdd/>}>Nuevo</Button>
                    </Link> */}
                </Col>
            </Row>
            <Table 
                loading={loading}
                dataSource={actasAdministrativo?.data} 
                size="small" 
                //loading={loading} 
                rowKey="{`${actaId}${actaAnio}`}" 
                //pagination={{current: currentPage, total: actasUsuario?.totalRows, showSizeChanger: false, pageSize: elementsNumber}} 
                //onChange={handleTableChange}
                //footer={() => <span style={{fontWeight: 'bold' }}>Nro. de registros {actasUsuario?.totalRows}</span>}
            > 
                <Column title="Acta"  width={25} 
                    render={
                        rowData => 
                        <Link to={
                            {
                            pathname: `/activos/aprobacion/solicitudCambio/${rowData.actaAnio}/${rowData.actaId}`
                            }}
                        >
                            {`${rowData.actaAnio} - ${rowData.actaId}`}
                        </Link>
                        
                    }
                />
                <Column title="Fecha"  width={15} 
                    render={rowData => (moment(rowData.fechaIngresa).format("DD/MM/YYYY"))}
                />
                <Column title="Destino" width={100}
                    render={rowData => (`${rowData.empleadoRecepta.empleado}`)}
                />
                {/* <Column title='Estado' key='estado' width={50}
                    render={rowData => 
                            rowData.estado == 'AP' 
                            ? <Tag color='green'>Aprobado</Tag> 
                            : rowData.estado == 'AN' 
                            ? <Tag color='red'>Anulado</Tag> 
                            : <Tag >Ingresado</Tag> 
                    }
                /> */}
                <Column title='Estado' width={10}
                    render={rowData => 
                            rowData.estado == 'AP' 
                            ? <>
                            <IoCheckmarkCircle style={{color: 'green', fontSize: '20px'}}/>
                            <IoPrintOutline style={{marginLeft:'9px', fontSize: '20px'}}/>
                             </>
                            : rowData.estado == 'AN' 
                            ? <IoCloseCircleOutline style={{color: 'red', fontSize: '20px'}}/>
                            : <IoInformationCircleOutline style={{ fontSize: '20px'}}/>
                    }
                />
            </Table>       
        </Card>
    )
}

export default ListaAprobacionCambioCustodio