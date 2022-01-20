import React, {useContext, useState, useEffect, useRef} from "react";
import { Link,  useParams, useLocation } from "react-router-dom";
import moment from 'moment';
import { Row, Col, Card, Tag, Button,  Descriptions,  
     Form, Input, Select, Skeleton, Radio, notification} from 'antd';
import UserContext from "../../../contexts/userContext";   
//import  AutoCompBusquedaPersona  from '../correspondencia/components/AutoCompBusquedaPersona';
import ModalBusquedaPersona from '../components/ModalBusquedaPersona'
import {getTipoOficios, createReserva, updateReserva } from '../services/correspondenciaService'
import { IoPersonOutline, IoClose, IoSearch, IoArrowBackOutline, IoCalendarOutline, IoSave } from "react-icons/io5";


require('dotenv').config();

const ReservaOficio = () => {

    const [frmReserva] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [reserva, setReserva] = useState();
    const [listaTipoOficios, setListaTipoOficios] = useState([]);
    const [noUpdate, setNoUpdate] = useState(false);
    const [showModalBusquedaPersona, setShowModalBusquedaPersona] = useState(false)
    const {usuario, apiHeader} = useContext(UserContext);    
    const [registroNuevo, setRegistroNuevo] = useState(true);
    const servidorAPI = `${process.env.REACT_APP_API_URL}reserva/`;
    const params = useParams();
    const txtDestinatario = useRef();
    const location = useLocation();

    useEffect( () => {
        async function obtenerData() {
            await obtenerTipoOficios();
            if (params.numeroOficio){
                console.log('parametros',params)
                obtenerReserva();
            }else{
                setRegistroNuevo(true);
                setReserva({
                    estado: 'P',
                    //anio: moment().year(),
                    usuario: usuario.usuario,
                    direccionNomina : {direccion: usuario.departamento}
                })
                frmReserva.setFieldsValue({'txtAnio': moment().year()})
            }
        } 
        if (usuario){
            obtenerData()
        }

    }, [usuario])

    const obtenerReserva = async () => {
        const response = await fetch(`${servidorAPI}reservaByNumero/${params.tipoOficioId}/${params.anio}/${params.numeroOficio}`, {method: 'GET', headers: apiHeader});
        const data = await response.json();
        if (response.status === 200){
            setReserva(data);
            cargaReserva(data)
        }else{
            throw new Error (`[${data.error}]`)                    
        }            
    }

    const cargaReserva = (data) => {
        data.estado !== 'P' && setNoUpdate(true);
        frmReserva.setFieldsValue({'lstTipoOficioId': data.tipoOficio.descripcion})
        frmReserva.setFieldsValue({'txtAsunto': data.asunto});
        frmReserva.setFieldsValue({'txtCopia': data.copia});
        data.destinatarioId && (txtDestinatario.current.input.disabled = true);
        frmReserva.setFieldsValue({'txtReferenciaDestinatario': data.referenciaDestinatario})
        frmReserva.setFieldsValue({'txtAnio': data.anio})
        frmReserva.setFieldsValue({'txtNumeroOficio': data.numeroOficio})
        data.fechaImpresion && frmReserva.setFieldsValue({'txtFechaImpresion': moment(data.fechaImpresion).format("DD/MM/YYYY")})
        frmReserva.setFieldsValue({'txtRespuesta': !data.respuesta ? 'N': data.respuesta})
        setRegistroNuevo(false);
    }

    const obtenerTipoOficios = async() => {
        const response = await fetch(`${servidorAPI}tipoOficio/ByDireccion/activos/${usuario.direccionId}`, {method: 'GET', headers: apiHeader});
        const data = await response.json();
        if (response.status === 200){
            setListaTipoOficios(data);
        }else{
            throw new Error (`[${data.error}]`)                    
        }            
    }

    const handleGrabar = () => {
        frmReserva.validateFields().then( async () => {

            if (registroNuevo){
                const payload = {
                    tipoOficioId : frmReserva.getFieldValue('lstTipoOficioId'),
                    direccionId: usuario.direccionId,
                    //anio : frmReserva.getFieldValue('txtAnio'),
                    referenciaDestinatario: frmReserva.getFieldValue('txtReferenciaDestinatario'),
                    anio : frmReserva.getFieldValue('txtAnio'),
                    asunto : frmReserva.getFieldValue('txtAsunto'),
                    copia : frmReserva.getFieldValue('txtCopia'),
                    usuario : usuario.usuario,
                    respuesta: frmReserva.getFieldValue('txtRespuesta'),
                    destinatarioId: reserva.destinatarioId,
                    estado: 'P'
                }
        
                const data  = await createReserva(payload, apiHeader);
                if (data){
                    setReserva({...reserva, ...payload,  numeroOficio: data.numeroOficio, fechaIngreso: moment(data.fechaIngreso).format('YYYY/MM/DD')})
                    notification['success']({
                        message: 'Reserva generada',
                        description : `Reserva ${data.numeroOficio}, generada con exito`
                    })
                    frmReserva.setFieldsValue({'txtNumeroOficio': data.numeroOficio});
                    setRegistroNuevo(false);
                    //cargaReserva(data)
                }
            }else {
                const {direccionNomina, tipoOficio, ...payload } = reserva;
                payload.asunto = frmReserva.getFieldValue('txtAsunto');
                payload.copia = frmReserva.getFieldValue('txtCopia');
                payload.respuesta = frmReserva.getFieldValue('txtRespuesta');
                payload.referenciaDestinatario = frmReserva.getFieldValue('txtReferenciaDestinatario')

                const data = await updateReserva(payload, apiHeader);

                console.log('actualizar', payload);

            }

    
        })
        

        // let response  = await fetch(`${servidorAPI}createReserva`, {method: "post", headers: apiHeader, body: JSON.stringify(payload)});
        // const data = await response.json();
        // if (response.status === 201){
        // }else{
        //     throw new Error (`[${data.error}]`)
        // }

    }

    const closeBusquedaPersona = (show, seleccionado) => {
        setShowModalBusquedaPersona(show);
        if (seleccionado){
            frmReserva.setFieldsValue({'txtReferenciaDestinatario': seleccionado.empleado})
            txtDestinatario.current.input.disabled = true;
            setReserva({...reserva, destinatarioId: seleccionado.id})
        }
    }

    const borraReferenciaDestinatario = () =>{
        frmReserva.setFieldsValue({'txtReferenciaDestinatario': ''})
        txtDestinatario.current.input.disabled = false
        setReserva({...reserva, destinatarioId: null})
    }


    return (
        <Card title={
            <Row>
                <Col span={18}>
                    Reserva de oficio
                </Col>
                {/* <Col span={6} style={{marginBottom: '2px', display: 'flex', justifyContent: 'end'}}>
                    {
                        reserva?.estado ==='P' ? <Tag size='small' color='blue'>Ingresado</Tag>
                        : reserva?.estado ==='R' ? <Tag size='small' color='green'>Remitido</Tag>
                        : reserva?.estado ==='A' && <Tag size='small' color='red'>Anulado</Tag>
                    }
                </Col> */}
            </Row>
        }> 
            <Skeleton loading={loading}>

            </Skeleton>
            <Form form={frmReserva} layout="horizontal">
                <Row>
                    <Col span={16}>
                        <Form.Item label="Oficio" labelCol={{span: 6}} >
                            <Form.Item name='lstTipoOficioId' style={{display:'inline-block', width:'40%'}}
                                rules={[{required: true, message: 'Debe seleccionar un tipo de oficio'}]}
                            >
                                {
                                    (registroNuevo || !reserva) ?
                                        <Select>
                                            {listaTipoOficios.map(item => <Select.Option key={item.id} value={item.id}>{item.descripcion}</Select.Option>)}
                                        </Select>
                                    :
                                        <Input size="small" readOnly></Input>
                                        
                                }
                                
                            </Form.Item>
                            <Form.Item  style={{display:'inline-block', width:'40%', paddingLeft: '3px'}}>
                                <Input.Group compact>
                                    <Form.Item name='txtAnio' noStyle >
                                        <Input size="small" style={{width:'30%'}} readOnly></Input>
                                    </Form.Item>
                                    <Form.Item name='txtNumeroOficio' noStyle >
                                        <Input size="small" style={{width:'70%'}} readOnly></Input>
                                    </Form.Item>
                                </Input.Group>
                            </Form.Item>
                            <Form.Item style={{display:'inline-block', width:'20%', paddingLeft: '3px'}}>
                                <div style={{width: '100%'}}>

                            {
                            reserva?.estado ==='P' ? <Tag size='small' color='blue'>Ingresado</Tag>
                            : reserva?.estado ==='R' ? <Tag size='small' color='green'>Remitido</Tag>
                            : reserva?.estado ==='A' && <Tag size='small' color='red'>Anulado</Tag>
                            }
                                </div>
                            </Form.Item>
                        </Form.Item>
                        <Form.Item label="Destinatario"  labelCol={{span: 6}} >
                            <Input.Group compact >
                                <Form.Item name="txtReferenciaDestinatario" style={{display: 'inline-block', width: 'calc(100% - 50px)' }}
                                    rules={[{required: true, message: 'Debe ingresar un destinatario'}]}
                                >
                                    <Input size="small" ref={txtDestinatario} readOnly={noUpdate}>

                                    </Input>
                                </Form.Item>
                                <Form.Item style={{display:'inline-block', }}>
                                    <Button size="small" icon={<IoSearch style={{fontSize: '18px', color: 'blue'}}></IoSearch>} 
                                        onClick={() => setShowModalBusquedaPersona(true)} disabled={noUpdate}
                                    >
                                    </Button>
                                </Form.Item>
                                <Form.Item style={{display:'inline-block', }}>
                                    <Button size="small" icon={<IoClose style={{fontSize: '18px', color:'red'}}></IoClose>} 
                                        onClick={() => borraReferenciaDestinatario()} disabled={noUpdate}
                                    >
                                    </Button>
                                </Form.Item>
                            </Input.Group>
                            {/* <AutoCompBusquedaPersona onSeleccionEmpleado={onSeleccionEmpleado} /> */}
                        </Form.Item>
                        <Form.Item label="Copia" name="txtCopia" labelCol={{span: 6}}>
                            <Input.TextArea size="small" rows={2} readOnly={noUpdate} >
                            </Input.TextArea>
                        </Form.Item>
                        <Form.Item label="Asunto" name="txtAsunto" labelCol={{span: 6}}
                            rules={[{required: true, message: 'Debe detallar el asunto del oficio'}]}                        
                        >
                            <Input.TextArea size="small" rows={4} readOnly={noUpdate} >
                            </Input.TextArea>
                        </Form.Item>

                        
                        <Row>
                             <Col span={12}>
                                <Form.Item label='Respuesta' name='txtRespuesta' labelCol={{span: 12}}  
                                    rules={[{required: true, message: 'Seleccione si necesita respuesta o no'}]}
                                >
                                    <Radio.Group optionType="button" buttonStyle="solid" disabled={noUpdate} >
                                        <Radio.Button value={'S'}>Si</Radio.Button>
                                        <Radio.Button value={'N'}>No</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col span={12}> 
                                <Form.Item label='Fecha Impresión' labelCol={{span: 12}}  name='txtFechaImpresion' >
                                    <Input size="small" readOnly></Input>
                                </Form.Item>
                                <Form.Item label='Fecha Estado' labelCol={{span: 12}}  name='txtFechaEstado' >
                                    <Input size="small" readOnly></Input>
                                </Form.Item>
                            </Col>
                        </Row>


                    </Col>
                    <Col span={8}>
                        <Descriptions style={{marginLeft: '15px'}} title="Solicitado por " size="small" >
                            <Descriptions.Item span={3}>{reserva?.direccionNomina.direccion}</Descriptions.Item>
                            <Descriptions.Item span={3}><IoPersonOutline style={{marginRight:'5px'}}></IoPersonOutline> {reserva?.usuario}</Descriptions.Item>
                            <Descriptions.Item span={3}><IoCalendarOutline style={{marginRight:'5px'}} ></IoCalendarOutline>{moment(reserva?.fechaIngreso).format("DD/MM/YYYY")}</Descriptions.Item>
                        </Descriptions>                        
                    </Col>
                </Row>
                <Row>
                    <Col span={24} offset={4} style={{marginTop:'15px'}}>
                        <Button type="primary" onClick={handleGrabar} icon={<IoSave></IoSave>} disabled={noUpdate}>Grabar</Button>
                        <Link to={{pathname: `/correspondencia/reservas`, filtro:location?.filtro, pagina:location?.pagina}}><Button icon={<IoArrowBackOutline style={{marginTop:'2px'}} />} ><span>Regresar</span></Button></Link>
                    </Col>
                </Row>
            </Form>
            <ModalBusquedaPersona show={showModalBusquedaPersona} onClose={closeBusquedaPersona}></ModalBusquedaPersona>            
        </Card>

        
    )
}

export default ReservaOficio
