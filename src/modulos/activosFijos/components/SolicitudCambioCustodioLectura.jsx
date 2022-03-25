import React, {useState, useEffect, useRef, useContext, Fragment}  from "react";
import {  Link, } from "react-router-dom";
import { Row, Col, Card, Table, Button, Result, notification, Popover, Badge, Input, Form, Space, Select, Tag } from 'antd';
import { IoPersonOutline, IoCalendarOutline, IoCheckmarkCircle, IoCloseCircleOutline, IoAdd, IoTrashOutline   } from 'react-icons/io5';
import TextArea from "antd/lib/input/TextArea";
import { useSelector } from "react-redux";

const SolicitudCambioCustodioLectura = () => {

    const { actaUsuario } = useSelector( state => state.custodio);    
    const [frmSolicitud]  = Form.useForm();
    const { Column } = Table;

    if (actaUsuario){
        frmSolicitud.setFieldsValue({'txtSolicitud': `${actaUsuario?.actaAnio}-${actaUsuario?.actaId}`})
        frmSolicitud.setFieldsValue({'txtRecepta': `${actaUsuario?.empleadoRecepta?.empleado}`})
        frmSolicitud.setFieldsValue({'txtEntrega': `${actaUsuario?.empleadoEntrega?.empleado}`})
        frmSolicitud.setFieldsValue({'txtObservacion': `${actaUsuario?.observacion}`})
        frmSolicitud.setFieldsValue({'txtFechaIngresa': actaUsuario?.fechaIngresa})
    }


    return (
        <Fragment>
        <Form form={frmSolicitud} layout="horizontal" >
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
                            {
                                actaUsuario?.estado === 'AP' ?
                                <>
                                <div><IoCheckmarkCircle style={{fontSize: '48px', color: 'green'}}/></div>
                                <div><h3 style={{margin: '2px'}}>Aprobado</h3></div>
                                <div>
                                    <div><h5 style={{margin: '2px'}}><IoPersonOutline></IoPersonOutline> {actaUsuario.usuarioAprueba} </h5></div>
                                    <div><h5 style={{margin: '2px'}}><IoCalendarOutline></IoCalendarOutline> {actaUsuario.fechaAprueba }</h5></div>
                                </div>
                                </>
                                : actaUsuario?.estado === 'AN' && 
                                <>
                                <div><IoCloseCircleOutline style={{fontSize: '48px', color: 'red'}}/></div>
                                <div><h3 style={{margin: '2px'}}>Anulado</h3></div>
                                </>
                            }
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
                    dataSource={actaUsuario?.detalle} 
                    size="small" 
                    rowKey="activoId" 
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
                    <Column title="Tipo"   width={180} 
                        sorter={{
                                compare: ((a,b)=> a.activo.tipoActivo.length - b.activo.tipoActivo.length),
                                }}
                        render={rowData => rowData?.activo?.tipoActivo}
                    />
                    <Column title="Clase"  width={180} 
                        sorter={{
                                compare: (a,b)=> a.activo.claseActivo.length - b.activo.claseActivo.length,
                                }
                                }
                        render={rowData => rowData?.activo?.claseActivo}
                    />
                    <Column title="Descripcion"  key="activoId" 
                        render={rowData => rowData?.activo?.descripcion}
                    />
                </Table>        
            </Col>
        </Row>

    </Fragment>    
    )
}

export default SolicitudCambioCustodioLectura