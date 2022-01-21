

import React, {useState, useEffect, useContext} from 'react'
import UserContext from '../../../contexts/userContext';
import moment from 'moment';
import { Row, Col, Card, Table, notification, Radio, Popover, Badge, Drawer, Button, Form, Input, Descriptions, Tag, Divider } from 'antd';
import TextArea from "antd/lib/input/TextArea";
import { IoArrowRedoOutline, IoArrowUndoOutline, IoCalendarClearOutline, IoDocumentTextOutline, 
    IoPersonOutline, IoChevronForwardCircleOutline, 
    IoMailOutline, IoPersonCircleOutline, IoSwapHorizontalOutline, IoCopyOutline } from 'react-icons/io5'
import { getOficioById} from  '../services/correspondenciaService'
    

const OficioVista = ({oficioId}) => {
    console.log('prop',oficioId);

    const servidorAPI = `${process.env.REACT_APP_API_URL}correspondencia/`;
    const [sumillas, setSumillas] = useState([]);
    const [oficio, setOficio] = useState({});
    const {usuario, apiHeader} = useContext(UserContext);

    const { Column } = Table;

    const [frmOficio]  = Form.useForm();

    

    useEffect(() => {

        async function obtenerData() {
            try {           
                const data = await getOficioById(oficioId, apiHeader);
                // const response = await fetch(`${servidorAPI}oficio/${oficioId}`, {method:'GET', headers: apiHeader});
                // const data = (await response.json());
                // if (response.status === 200){
                //     setOficio(data);
                //     //setShowDetalle(true);
                //     llenaFormulario(data);
                // }else{
                //     throw new Error (`[${data.error}]`)                    
                // }            
                //setSumillas(data);
                setOficio(data);
                setSumillas(data.sumillas);
                llenaFormulario(data);

            } catch (error) {
                notification['error']({
                    message: 'Error',
                    description: `Error al cargar los oficios ${error}`
                  });    
            }
        }
        if (usuario) obtenerData();
    }, [usuario, oficioId])

    const handleShowDetalle = async (id) => {
       
    }

    const llenaFormulario = (datos) =>{
        frmOficio.setFieldsValue({'txtRegistro': `${datos.anio}- ${datos.registroDpto}`})
        frmOficio.setFieldsValue({'txtOficio': `${datos?.tipoOficio} - ${datos?.anio} - ${datos?.digitos}`})
        frmOficio.setFieldsValue({'txtRemitente': ` ${datos.usuarioOrigen} - ${datos.dptoOrigen}`})
        frmOficio.setFieldsValue({'txtDestinatario': datos.usuarioDestino})
        frmOficio.setFieldsValue({'txtAsunto': datos.asunto})
        frmOficio.setFieldsValue({'txtObservacion': datos.observacion})
    }


    
    return (
        
    <Form form={frmOficio} layout="horizontal">
    <Row>
        <Col span={18}>
            <Row>
                <Col span={12}>
                    <Form.Item label="Registro" name="txtRegistro" labelCol={{span: 6}}>
                    <Input disabled prefix={<IoChevronForwardCircleOutline/>}></Input>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Oficio" name="txtOficio" labelCol={{span: 6}}>
                    <Input disabled prefix={<IoDocumentTextOutline></IoDocumentTextOutline>}></Input>
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item label="Remitente" name="txtRemitente" labelCol={{span: 3}}>
                    <Input disabled prefix={oficio?.tipoDocumento === 'I'? <IoPersonOutline/> : <IoMailOutline></IoMailOutline>}></Input>
            </Form.Item>
            <Form.Item label="Destinatario" name="txtDestinatario" labelCol={{span: 3}}>
                    <Input disabled prefix={<IoPersonCircleOutline/>}></Input>
            </Form.Item>
            <Form.Item label="Asunto" name="txtAsunto" labelCol={{span: 3}}>
                <TextArea style={{backgroundColor:"#daedff", border:"1px solid #afd8ff", color:"black"}} disabled rows="3" ></TextArea>
            </Form.Item>

        </Col>
        <Col span={6}>
        <Descriptions bordered size="small">
                <Descriptions.Item label="Ingresado :" span={3}>{`${oficio?.usuario}`} </Descriptions.Item>
                <Descriptions.Item label="Fecha ingreso:" span={3}>{`${moment(oficio?.fechaIngreso).format("DD/MM/YYYY")}`} </Descriptions.Item>
        </Descriptions>
        </Col>
    </Row>
    <Row>
        <Col span={24}>
            <Divider orientation='left'>Sumillas</Divider>
            <Table dataSource={sumillas} size="small" pagination={false} rowKey="sumiIdSecRegistro" > 
                        <Column title="FechaSumilla" key="fechaSumilla" width={30} 
                            sorter={(a, b) => moment(a.fechaSumilla).unix() - moment(b.fechaSumilla).unix()}
                            render={rowData => (moment(rowData.fechaSumilla).format("DD/MM/YYYY"))}/>
                        <Column title="Sumillado" width={200} 
                            render={rowData => {return(
                                <div>
                                    <div>
                                        {rowData.sumiUsuarioDestino}
                                    </div>
                                    <div style={{color: 'green', fontSize:'10px', fontStyle:"italic"}}>
                                        {rowData.sumiDptoDestino}
                                    </div>
                                </div>
                            )}}
                        />
    
                        <Column title="Sumilla" 
                            render={
                                rowData => {return(
                                    <div>
                                        <div> 
                                            <IoArrowRedoOutline style={{size:"10px",  marginRight:"5px", color:"#a97817"}}></IoArrowRedoOutline>
                                            {`${rowData.sumilla} `}
                                        </div>
                                        {rowData.registroContesta &&
                                        <div style={{fontSize:'11px', color:"#004c9e", marginTop:"8px",  marginLeft:"15px", borderTop:"1px dotted #c0d5ec" }}>
                                            <div >
                                                <IoArrowUndoOutline style={{size:"10px",  marginRight:"5px"}}/>
                                                <span >
                                                {`Contesta: ${rowData.registroContesta}`}  
                                                </span>
                                                <IoCalendarClearOutline style={{fontSize:"12px", marginLeft:"15px",  marginRight:"5px"}}/>
                                                {moment(rowData.sumiFechaContesta).format('DD/MM/YYYY')}
                                                <IoDocumentTextOutline style={{fontSize:"12px", marginLeft:"15px", marginRight:"5px"}}/>
                                                {`${rowData.oficioContesta} - ${rowData.anioContesta} - ${rowData.digitosContesta}`}
                                            </div>
                                            <div>
                                            </div>
                                            <span> 
                                                {`${rowData.contestacion ? rowData.contestacion : ''  } `}
                                            </span>
                                        </div>}
                                    </div>
                                )}
                            }
                        />
                        <Column title="Estado"  width={50}  
                            render={
                                rowData => { 
                                    let color;
                                    rowData.sumiEstadoUsuarios === 'E' ? color = "green"
                                    : rowData.sumiEstadoUsuarios === 'S' ? color = 'red'
                                    : rowData.sumiEstadoUsuarios === 'C' ? color = 'blue'
                                    :color = "";
                                    return(
                                    rowData.sumiEstadoUsuarios === "S" ? 
                                        <Badge count={rowData.diasEspera} size="small" offset={[-5,6]} style={{fontSize: "11px"}}>
                                            <Tag color={color} style={{fontSize:"10px", height:"22px"}}>
                                                {rowData.estadoSumilla}
                                            </Tag>
                                        </Badge>
                                    :    
                                    <div>
                                        <Tag color={color}  style={{fontSize:"10px", height:"22px"}}>
                                            {rowData.estadoSumilla}
                                        </Tag>
                                    </div>
                                )}
                            }
                        />
                    </Table>       
        </Col>
    </Row>
    </Form>

       )
}

export default OficioVista
