import React, {useState, useEffect, useRef, useContext}  from "react";
import {  Link, useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch} from 'react-redux'
import { Row, Col, Card, Table, Button, Input, Form, Divider, Space, Modal, notification, Spin } from 'antd';
import { getActaCambioCustodio, createNewSolicitud, areaDetalleSolicitudCambioEstado, apruebaActaSolicitudCambioEstado } from '../actions/custodioAction'
import {  getAreas } from '../services/custodioServices'
import UserContext from "../../../contexts/userContext";
import { IoArrowBack, IoPersonOutline, IoCalendarOutline, 
        IoInformationCircleOutline, IoCheckmarkCircleSharp, IoFileTrayFullOutline,
        IoCheckmarkSharp, IoCheckmarkDoneSharp
       } 
from 'react-icons/io5';
import TextArea from "antd/lib/input/TextArea";

import SolicitudCambioCustodioLectura from "../components/SolicitudCambioCustodioLectura";
import SolicitudCambioCustodioEdit from "../components/SolicitudCambioCustodioEdit";

const AprobarSolicitudCambioCustodio = () =>{

    const params = useParams();
    const [pageReadOnly, setPageReadOnly] = useState(true);
    const [newRecord, setNewRecord] = useState(false);
    const [showAreas, setShowAreas] = useState(false);
    const [listaAreas, setListaAreas] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedDetalle, setSelectedDetalle] = useState();
    const { actaUsuario, loading, loadingDetail, loadingAprueba, apruebaSuccess } = useSelector( state => state.custodio);
    const {usuario} = useContext(UserContext);
    const dispatch = useDispatch();
    const { Column } = Table;
    const [frmSolicitud]  = Form.useForm();
    const history = useHistory();

    useEffect(()=>{ 
        console.log('efecto');
        if (params.anio && params.anio > 0) {
            setPageReadOnly(true);
            setNewRecord(false);
            dispatch(getActaCambioCustodio(params.anio, params.actaId));
        }
        // else if (params.anio == 0){
        //     console.log('nuevo');
        //     dispatch(createNewSolicitud());
        //     setNewRecord(true);
        //     setPageReadOnly(false);
        // }
        if (apruebaSuccess){
            console.log('aprueba');
            history.push(`/activos/aprobacion/solicitudCambio`);
        }

    },[dispatch, usuario, apruebaSuccess, loadingDetail])

    if (actaUsuario){
        frmSolicitud.setFieldsValue({'txtSolicitud': `${actaUsuario?.actaAnio}-${actaUsuario?.actaId}`})
        frmSolicitud.setFieldsValue({'txtRecepta': `${actaUsuario?.empleadoRecepta?.empleado}`})
        frmSolicitud.setFieldsValue({'txtEntrega': `${actaUsuario?.empleadoEntrega?.empleado}`})
        frmSolicitud.setFieldsValue({'txtObservacion': `${actaUsuario?.observacion}`})
        frmSolicitud.setFieldsValue({'txtFechaIngresa': actaUsuario?.fechaIngresa})
    }

    async function clickAreas(actadetId) {
        console.log('actadet_', actadetId)
        console.log('acta usua1', actaUsuario);
        setSelectedDetalle(actadetId);
        setListaAreas(await getAreas(usuario.direccionId))
        setShowAreas(true);
    }

    async function addSelected(todos){
        let {descripcion} = [...listaAreas.filter(i => i.areaId === selectedRows[0])][0]
        console.log('acta usua', actaUsuario);
        if (selectedRows.length > 0){
         dispatch(areaDetalleSolicitudCambioEstado({actadetId : selectedDetalle, 
                                        actaAnio: actaUsuario.actaAnio, 
                                        actaId: actaUsuario.actaId,
                                        areaId: selectedRows[0],
                                        acta: actaUsuario,
                                        todos,
                                        area: descripcion
                                    }))
         setShowAreas(false);
        }
    }

    async function clickAprobar(){
        if ((actaUsuario.detalle.filter(i => i.areaId === null).length > 0) || (actaUsuario.detalle.length == 0)){
            notification['warning']({
                message: 'Aprobación',
                description: 'Debe seleccionar una ubicación para todos los activos'
            });
        }else{
            const key=`key${Date.now}`

            notification['warning']({
                message: 'Aprobación',
                description: 'Seguro desea aprobar el cambio de custodio de los activos',
                key,
                btn:(<>
                <Button type="primary" size="small" onClick={() => apruebaSolicitud(key)}>Aceptar</Button>
                </>)
            });

        }
    }

    async function apruebaSolicitud(key){
        dispatch(apruebaActaSolicitudCambioEstado(actaUsuario.actaAnio, actaUsuario.actaId, usuario.usuario))
        notification.close(key);
        // setTimeout(() => {
        //     history.push(`/activos/aprobacion/solicitudCambio`);
        // }, 2000);
    }
  
    return (
        <>
        <Spin tip='Aprobando Solicitud...' spinning={loadingAprueba} >
        <Card title='Solicitud de cambio de custodio' size="small" loading={loading} 
        extra={<Link to={{pathname: `/activos/aprobacion/solicitudCambio`}}><Button icon={<IoArrowBack style={{marginTop:'2px'}} />} size="small" ><span>Regresar</span></Button></Link>}>
            <Form form={frmSolicitud} layout="horizontal" >
                <Row>
                    <Form.Item>
                    <Space>

                    <Button type="primary"  icon={<IoCheckmarkCircleSharp/>} style={{backgroundColor: 'green'}} onClick={clickAprobar}> Aprobar </Button>                    
                    {/* <Link to={{pathname: `/activos/solicitudCambio`}}><Button icon={<IoArrowBack/>} ><span>Regresar</span></Button></Link> */}
                    </Space>
                    </Form.Item>
                    <Col span={24} >
                        <Divider style={{margin:4}}></Divider>
                    </Col>
                </Row>
                <Row>
                    <Col span={18}>
                            <Row>
                                <Col span={24}>
                                    <Row>
                                        <Col span={12}>
                                            <Form.Item label="Solicitud" name="txtSolicitud" labelCol={{span: 6}}>
                                            <Input readOnly size="small" ></Input>
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item label="Fecha" name="txtFechaIngresa" labelCol={{span: 6}}>
                                            <Input prefix={<IoCalendarOutline/>} readOnly size="small" ></Input>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label="Entrega:" name="txtEntrega" labelCol={{span: 3}}>
                                    <Input prefix={<IoPersonOutline/>} readOnly size="small" ></Input>
                                    </Form.Item>
                                </Col>  	
                                <Col span={24}>
                                    <Form.Item label="Recepta:" name="txtRecepta" labelCol={{span: 3}}>
                                    <Input prefix={<IoPersonOutline/>} readOnly  size="small" ></Input>
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label="Observacion:"  name="txtObservacion" labelCol={{span: 3}}>
                                    <TextArea readOnly  rows="3"></TextArea>
                                    </Form.Item>
                                </Col>
                            </Row>
                    </Col>
                    <Col span={6}>
                        <Row style={{padding: '4px', height: '100%'}}>
                            <Col span={24}>
                                <Card style={{textAlign: 'center', height: '100%'}}>
                                    <div><IoInformationCircleOutline style={{fontSize: '48px'}}/></div>
                                    <div><h3 style={{margin: '2px'}}>Ingresado</h3></div>

                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Form>
            <h4>Lista de activos</h4>
            <Row>
                <Col span={24}>
                    <Table 
                        loading={loadingDetail}
                        dataSource={actaUsuario?.detalle} 
                        size="small" 
                        rowKey="actadetId" 
                        pagination={false}
                        scroll={{y: window.innerHeight - 425 }}
                        footer={() => <span style={{fontWeight: 'bold' }}>Nro. de registros {actaUsuario?.detalle?.length}</span>}
                    > 

                        <Column title="CodEmapag"  key="activoId" width={78} 
                            render={rowData => rowData?.activo?.codigoEcapag}
                        />
                        <Column title="CodControl"  key="activoId" width={78} 
                            render={rowData => rowData?.activo?.codigoActivoControl}
                        />
                        <Column title="Tipo"   width={120} 
                            sorter={{
                                    compare: ((a,b)=> a.activo.tipoActivo.length - b.activo.tipoActivo.length),
                                    }}
                            render={rowData => rowData?.activo?.tipoActivo}
                        />
                        <Column title="Clase"  width={120} 
                            sorter={{
                                    compare: (a,b)=> a.activo.claseActivo.length - b.activo.claseActivo.length,
                                    }}
                            render={rowData => rowData?.activo?.claseActivo}
                        />
                        <Column title="Descripcion"  key="activoId" 
                            render={rowData => rowData?.activo?.descripcion}
                        />
                        <Column title='Ubicación'  width={150} 
                            render={rowData => <><Button loading={loadingDetail} type="link" icon={<IoFileTrayFullOutline style={{fontSize: '20px'}} />} onClick={()=> clickAreas(rowData.actadetId)} > </Button>{rowData?.area?.descripcion} </>}
                        />

                    </Table>        
                </Col>
            </Row>
        </Card>
        </Spin>
        <Modal
            title="Buscar areas"
            visible={showAreas}
            onCancel={() => setShowAreas(false)}
            //onOk={() => addSelected()}
            okText="Agregar"
            cancelText="Cancelar"
            width={900}
            style={{top:20}}
            footer={[
                <Button icon={<IoCheckmarkSharp></IoCheckmarkSharp>} type='primary' onClick={()=> addSelected(false)}>Asignar</Button>,
                <Button icon={<IoCheckmarkDoneSharp></IoCheckmarkDoneSharp>} onClick={()=> addSelected(true)}>Asignar a todos </Button>,
                <Button>Cancel</Button>,
            ]}
            >
                <Table
                    dataSource={listaAreas} 
                    size="small" 
                    rowKey="areaId" 
                    pagination={false}
                    selected
                    rowSelection={{type:'radio',selectedRowKeys: selectedRows, onChange: (selectedRowKeys)=> setSelectedRows(selectedRowKeys)}}
                    //rowSelection={{setSelectedRows: selectedRows, onChange: selected }}
                    //rowSelection={{selectedRowKeys: selectedRows, onChange: (selectedRowKeys)=> setSelectedRows(selectedRowKeys)}}
                    scroll={{y: 600 }}
                    //footer={() => <span style={{fontWeight: 'bold' }}>Nro. de registros {listaActivos?.length}</span>}    
                >
                    <Column title="Ubicación"  key="areaId" width={180} 
                        render={rowData => rowData.descripcion}
                    />
                </Table>
        </Modal>
        </>
    )

}

export default AprobarSolicitudCambioCustodio