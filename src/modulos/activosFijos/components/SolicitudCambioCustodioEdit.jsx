import React, {useState, useEffect, useRef, useContext, Fragment}  from "react";
import {  Link, useHistory } from "react-router-dom";
import { Row, Col, Result, Card, Table, Button, Modal, PageHeader, Badge, Input, Form, Space, Select, Tag, Divider, notification } from 'antd';
import TextArea from "antd/lib/input/TextArea";
import { useSelector, useDispatch } from "react-redux";
import { IoPersonOutline, IoCalendarOutline, IoSave, IoArrowBack, IoAdd, IoTrashOutline, IoInformationCircleOutline   } from 'react-icons/io5';
import UserContext from "../../../contexts/userContext";
import SearchEmpleado from "../../generales/components/SearchEmpleado";
import ListaActivosCustodio from "./ListaActivosCustodio";
import {  
        updateSolicitudCambioEstado,
         } from '../services/custodioServices'
import { createSolicitudCambioEstado, 
         createDetalleSolicitudCambioEstado, 
         deleteDetalleSolicitudCambioEstado,
        getActaCambioCustodio } from '../actions/custodioAction';



const SolicitudCambioCustodioEdit = ({newRecord}) => {
    console.log('<<<< render >>>>>> SolicitudCambioCustodioEdit', )
    const [editNewRecord, setEditNewRecord] = useState(newRecord);
    const { actaUsuario, success } = useSelector( state => state.custodio);    
    const dispatch = useDispatch();
    const [frmSolicitud]  = Form.useForm();
    const { Column } = Table;
    const {usuario} = useContext(UserContext);
    const [showBusquedaEmpleado, setShowBusquedaEmpleado] = useState(false);
    const [showListaActivos, setShowListaActivos] = useState(false);
    const [actaEdit, setActaEdit] = useState({})
    const [selectedRows, setSelectedRows] = useState([]);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const history = useHistory();

    useEffect(()=>{
        if (Object.keys(actaUsuario).length === 0 ){
            frmSolicitud.setFieldsValue({'txtEntrega': `${usuario?.empleado}`});
            frmSolicitud.setFieldsValue({'txtSolicitud': ''})
            frmSolicitud.setFieldsValue({'txtRecepta': ''})
            frmSolicitud.setFieldsValue({'txtObservacion': ''})
            frmSolicitud.setFieldsValue({'txtFechaIngresa': ''})
            setActaEdit({
                observacion: '',
                empleadoEntregaId: usuario?.codigo,
                empleadoReceptaId: null,
                detalle: []
            })                    
        }else{
            frmSolicitud.setFieldsValue({'txtSolicitud': `${actaUsuario?.actaAnio}-${actaUsuario?.actaId}`})
            frmSolicitud.setFieldsValue({'txtRecepta': `${actaUsuario?.empleadoRecepta?.empleado}`})
            frmSolicitud.setFieldsValue({'txtEntrega': `${actaUsuario?.empleadoEntrega?.empleado}`})
            frmSolicitud.setFieldsValue({'txtObservacion': `${actaUsuario?.observacion}`})
            frmSolicitud.setFieldsValue({'txtFechaIngresa': actaUsuario?.fechaIngresa})
            setActaEdit({...actaUsuario})   
        }
    }, [usuario, editNewRecord, success, actaUsuario,])


    const closeSearchEmpleado = async(show, seleccionado) => {
        setShowBusquedaEmpleado(show);
        if (seleccionado){
            frmSolicitud.setFieldsValue({'txtRecepta': `${seleccionado?.empleado}`})
            setActaEdit({...actaEdit, empleadoReceptaId: seleccionado?.codigo, direccionId: seleccionado.direccionId });
        }
    }

    const save = () => {
        if (Object.keys(actaUsuario).length === 0){
            const payload = {...actaEdit, 
                observacion: frmSolicitud.getFieldValue('txtObservacion'),
                usuarioIngresa: usuario.usuario
            }
            dispatch(createSolicitudCambioEstado(payload))
            setEditNewRecord(false);
        }else{
            const payload = {...actaEdit,
                observacion: frmSolicitud.getFieldValue('txtObservacion'),
            }
            updateSolicitudCambioEstado(payload);
            notification['success']({
                message: 'Grabar',
                description: 'Datos actualizados.'
            })
        }
    }

    const closeAddActivo = async(show, selecteds) => {
        setShowListaActivos(show);
        let detalle = [];
        if (selecteds.length > 0){
            selecteds.map(async i => {
                detalle.push({
                    actadetId: Math.floor(Math.random() * 1000),
                    activoId: i.activoId,
                    activo: {
                        codigoEcapag: i.activo.codigoEcapag,
                        codigoActivoControl: i.activo.codigoActivoControl,
                        tipoActivo: i.activo.tipoActivo,
                        claseActivo: i.activo.claseActivo,
                        descripcion: i.activo.descripcion
                    }
                })
                if (!newRecord){
                    dispatch(createDetalleSolicitudCambioEstado({
                        actaId: actaUsuario.actaId,
                        actaAnio: actaUsuario.actaAnio,
                        activoId: i.activoId,
                        activo: i.activo
                    }));
                }
            })
            setActaEdit({...actaEdit, detalle})
        }
    }

    function closeModal (){
        history.push(`/activos/solicitudCambio`);
    }

    async function confirmDelete(){
        if (selectedRows.length > 0){
            console.log('entra a borrar', selectedRows)
            let detalle = actaEdit.detalle;
            selectedRows.map(async item => {
               detalle = [...detalle.filter( x => x.actadetId != item)];
               if (!newRecord) dispatch(deleteDetalleSolicitudCambioEstado(item));               
            });
            setActaEdit({...actaEdit, detalle})
            setShowModalDelete(false);
            setSelectedRows([]);
        }
    }

    return (
        <Fragment>
        <Form form={frmSolicitud} layout="horizontal">
            
            <Row>
                <Form.Item>
                <Space>

                <Button type="primary" disabled={!(actaEdit?.empleadoReceptaId && actaEdit?.detalle.length>0)} 
                        onClick={()=>save()} icon={<IoSave/>}> Grabar </Button>                    
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
                            <Input.Search prefix={<IoPersonOutline/>} readOnly  size="small" enterButton onSearch={()=>setShowBusquedaEmpleado(true)} ></Input.Search>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="Observacion:" name="txtObservacion" labelCol={{span: 3}}>
                            <TextArea  rows="3"></TextArea>
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
        {/* <Card title='Lista de activos a transferir' size="small"> */}

        
        <h4>Lista de activos</h4>

            <Row>
                <Col span={24} style={{backgroundColor: '#efefef'}}>
                <Button onClick={()=>setShowListaActivos(true)} size='small' icon={<IoAdd/>}> Agregar activo </Button>
                <Button onClick={()=>setShowModalDelete(true)} size='small' disabled={!selectedRows?.length > 0} icon={<IoTrashOutline/>}> Borrar activos</Button>

                </Col>
            </Row>        
            <Row>
                <Col span={24}>
                    <Table 
                        dataSource={actaEdit?.detalle} 
                        size="small" 
                        rowKey="actadetId" 
                        pagination={false}
                        scroll={{y: window.innerHeight - 425 }}
                        selected
                        rowSelection={{selectedRowKeys: selectedRows, onChange: (selectedRowKeys)=> setSelectedRows(selectedRowKeys)}}
                        footer={() => <span style={{fontWeight: 'bold' }}>Nro. de registros {actaUsuario?.detalle?.length}</span>}
                    > 
                        <Column title="CodEmapag"  key="codigoEcapag" width={78} 
                        sorter={(a,b)=> a.activo.codigoEcapag?.localeCompare(b.activo.codigoEcapag)}
                            render={rowData => rowData?.activo?.codigoEcapag}
                        />
                        <Column title="CodControl" width={70} 
                            render={rowData => rowData?.activo?.codigoActivoControl}
                        />
                        <Column title="Tipo"   width={180} 
                            sorter={(a,b)=> a.activo.tipoActivo?.localeCompare(b.activo.tipoActivo)}
                            render={rowData => rowData?.activo?.tipoActivo}
                        />
                        <Column title="Clase"  width={180} 
                            sorter={(a,b)=> a.activo.claseActivo?.localeCompare(b.activo.claseActivo)}
                            render={rowData => rowData?.activo?.claseActivo}
                        />
                        <Column title="Descripcion"  
                            render={rowData => rowData?.activo?.descripcion}
                        />
                    </Table>        
                </Col>
            </Row>
        {/* </Card> */}

        <ListaActivosCustodio show={showListaActivos} onClose={closeAddActivo} activosExistentes={actaEdit.detalle?.map(i => i.activoId)}></ListaActivosCustodio>

        <SearchEmpleado show={showBusquedaEmpleado} onClose={closeSearchEmpleado}></SearchEmpleado>
        <Modal
            title='Confirmación'
            visible={success}
            onOk={()=> closeModal()}
        >
            <h2>Acta {`${actaUsuario.actaAnio} - ${actaUsuario.actaId} creada con exito.`}</h2>
        </Modal>

        <Modal
            title='Confirmación de borrar'
            visible={showModalDelete}
            onCancel={() => setShowModalDelete(false)}
            onOk={()=> confirmDelete()}
        >
            <h3>Seguro desea borrar los activos seleccionados?</h3>
        </Modal>


    </Fragment>    
    )
}

export default SolicitudCambioCustodioEdit