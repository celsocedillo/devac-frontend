import React, {useState, useEffect}  from "react";
import {  Link, useLocation, useParams } from "react-router-dom";
import { Row, Col, Card, Table, Tag, Button, notification, Badge, Space, Descriptions,  
         Tabs, Tooltip, Form, Input, Modal, Select, AutoComplete, Spin, Popconfirm,
        Skeleton } from 'antd';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { IoArrowRedoOutline, IoArrowUndoOutline, IoCalendarClearOutline, IoDocumentTextOutline, 
         IoPersonOutline, IoExitOutline, IoTrashOutline, IoPencil, IoChevronForwardCircleOutline,
         IoMailOutline, IoPersonCircleOutline, IoArrowBackCircleOutline, IoArrowBackOutline } from 'react-icons/io5'
import { HiOutlineOfficeBuilding } from 'react-icons/hi';
import TextArea from "antd/lib/input/TextArea";
import moment from 'moment';




const Oficio = (props) => {
    

    const [oficio, setOficio] = useState({})
    const [loading, setLoading] = useState(true);
    const [departamentos, setDepartamentos] = useState([]);
    const [estadoUsuarios, setEstadoUsuarios] = useState([]);
    const [visAgregaSumilla, setVisAgregaSumilla] = useState(false);
    const [sumillas, setSumillas] = useState([]);
    const [clientesFiltrados, setClientesFiltrados] = useState([]);
    const [confirmBorrar, setConfirmBorrar]=useState(false);
    const [sumillaActual, setSumillaActual]=useState({
        anioContesta: null,
        contestacion: null,
        diasEspera: null,
        digitosContesta: null,
        estadoSumilla: null,
        fechaSumilla: moment(),
        observacion: null,
        registroContesta: null,
        siglas: null,
        sumiDptoDestino: null,
        sumiEstadoUsuarios: null,
        sumiFechaContesta: null,
        sumiFechaVencimiento: null,
        sumiIdDpto: null,
        sumiIdSecRegistro: null,
        sumiIdUsuarioDestino: null,
        sumiIdRegistroDpto: null,
        sumiUsuarioDestino: null,
        sumilla: null,
        sumillado: null
    });
    const [nuevaSumilla, setNuevaSumilla]=useState(false)

    const servidorAPI = process.env.REACT_APP_API_URL;
    const [frmAgregaSumilla]  = Form.useForm();
    const [frmOficio]  = Form.useForm();
    const params = useParams();
    const location = useLocation();

    const { Column } = Table;
    const {TabPane} = Tabs;

    useEffect( () => {
        console.log("location", location);
        obtenerOficio();
        obtenerDepartamentos();
        obtenerEstadoUsuarios();
    }, [])

    const obtenerOficio = async () => {
        try {           
            setLoading(true);
            const response = await fetch(`${servidorAPI}oficio/${params.id}`);
            const data = (await response.json());
            if (response.status === 201){
                console.log("oficio", data.data);
                setOficio(data.data);
                llenaFormulario(data.data);
            }else{
                throw new Error (`[${data.error}]`)                    
            }            
            setLoading(false);
            setSumillas(data.data.sumillas);
        } catch (error) {
            notification['error']({
                message: 'Error',
                description: `Error al cargar los oficios ${error}`
              });    
        }
    }

    const obtenerDepartamentos = async () => {
        try {
            const response = await fetch(`${servidorAPI}departamentos`);
            const data = (await response.json());
            if (response.status === 201){
                console.log("departamentos", data.data);
                setDepartamentos(data.data);
            }else{
                throw new Error (`[${data.error}]`)                    
            }            
            
        } catch (error) {
            notification['error']({
                message: 'Error',
                description: `Error al cargar los Departamentos ${error}`
              });                
        }
    }

    const obtenerEstadoUsuarios = async () => {
        try {
            const response = await fetch(`${servidorAPI}estadoUsuarios`);
            const data = (await response.json());
            if (response.status === 201){
                console.log("estados", data.data);
                setEstadoUsuarios(data.data);
            }else{
                throw new Error (`[${data.error}]`)                    
            }            
            
        } catch (error) {
            notification['error']({
                message: 'Error',
                description: `Error al cargar los estados ${error}`
              });                
        }
    }

    const llenaFormulario = (datos) =>{
        frmOficio.setFieldsValue({'txtRegistro': `${datos.anio}- ${datos.registroDpto}`})
        frmOficio.setFieldsValue({'txtOficio': `${datos?.tipoOficio} - ${datos?.anio} - ${datos?.digitos}`})
        frmOficio.setFieldsValue({'txtRemitente': ` ${datos.usuarioOrigen} - ${datos.dptoOrigen}`})
        frmOficio.setFieldsValue({'txtDestinatario': datos.usuarioDestino})
        frmOficio.setFieldsValue({'txtAsunto': datos.asunto})
        frmOficio.setFieldsValue({'txtObservacion': datos.observacion})
    }

    const clickSumillaDirecta = (item) => {
        setNuevaSumilla(true);
        setVisAgregaSumilla(true);
        setSumillaActual({...sumillaActual,
            fechaSumilla: moment(),
            sumiIdUsuarioDestino: item.usuario,
            sumiUsuarioDestino: item.empleado,
            sumiIdDpto: item.corrIdDepartamento,
            sumiDptoDestino: item.departamento
        }); 
        frmAgregaSumilla.resetFields();       
        frmAgregaSumilla.setFieldsValue({'txtUsuario':item.empleado})
        frmAgregaSumilla.setFieldsValue({'txtDepartamento':item.departamento})
    }

    const clickSumilla = () => {
        setNuevaSumilla(true);
        setVisAgregaSumilla(true);
        setSumillaActual({...sumillaActual,
            fechaSumilla: moment()
        }); 
        frmAgregaSumilla.resetFields();
    }

    const aceptarSumilla = async () =>{
        frmAgregaSumilla.validateFields().then( async values => {
            setVisAgregaSumilla(false);
            let registro = {...sumillaActual, 
                sumilla: frmAgregaSumilla.getFieldValue('txtSumilla'),
                sumiEstadoUsuarios: frmAgregaSumilla.getFieldValue('sltEstadoUsuarios'),
                idRegistro2: oficio.id,
                idSecRegistro2: oficio.idSecRegistro,
                idRegistro: oficio.id,
                fechaSumilla: moment(),
                estadoSumilla:  estadoUsuarios.filter(item => item.id === frmAgregaSumilla.getFieldValue('sltEstadoUsuarios'))[0].estado   
            }
            nuevaSumilla ? insertaSumilla(registro) : updateSumilla(registro);
            frmAgregaSumilla.resetFields();
        }).catch(info => {
            console.log("Validacion");
        })
    }

    const insertaSumilla = async (registro) => {
        try {
            let response  = await fetch(`${servidorAPI}sumilla`, {method: "post", headers: {'Content-Type':'application/json'}, body: JSON.stringify(registro)});
            const data = await response.json();
            if (response.status === 201){
                let cambio = [...sumillas];
                registro.sumiIdSecRegistro= data.data;
                registro.estadoSumilla = estadoUsuarios.filter(item => item.id === registro.sumiEstadoUsuarios)[0].estado   
                cambio.push(registro);
                setSumillas(cambio);
            }else{
                throw new Error (`[${data.error}]`)
            }
        } catch (error) {
            notification['error']({
                message: 'Error',
                description: `Error al grabar la sumilla ${error}`
            });
        }
    }

    const updateSumilla = async (registro) =>{
        try {
            let response  = await fetch(`${servidorAPI}sumilla`, {method: "put", headers: {'Content-Type':'application/json'}, body: JSON.stringify(registro)});
            if (response.status === 201){
                let cambio = [...sumillas];
                cambio = cambio.map( item => item.sumiIdSecRegistro === registro.sumiIdSecRegistro ? registro:item);
                setSumillas(cambio);
            }
        } catch (error) {
            notification['error']({
                message: 'Error',
                description: `Error al editar la sumilla ${error}`
            });            
        }
    }

    const deleteSumilla = async (pid) =>{
        try {
            setConfirmBorrar(true);
            let response  = await fetch(`${servidorAPI}sumilla/${pid}`, {method: "delete", headers: {'Content-Type':'application/json'}});
            const data = await response.json();
            if (response.status === 201){
                let cambio = [...sumillas];
                let nuevas = cambio.filter(item => item.sumiIdSecRegistro !== pid);
                setSumillas(nuevas);
            }else{
                throw new Error (`[${data.error}]`)
            }
        } catch (error) {
            notification['error']({
                message: 'Error',
                description: `Error al borrar la sumilla ${error}`
            });            
        }
        setConfirmBorrar(false);                  
    }

    const editarSumilla = (item) => {
        setNuevaSumilla(false);
        setVisAgregaSumilla(true);
        setSumillaActual({...item});
        frmAgregaSumilla.setFieldsValue({'txtUsuario':item.sumiUsuarioDestino})
        frmAgregaSumilla.setFieldsValue({'txtDepartamento':item.sumiDptoDestino})
        frmAgregaSumilla.setFieldsValue({'txtSumilla':item.sumilla})
        frmAgregaSumilla.setFieldsValue({'sltEstadoUsuarios': item.sumiEstadoUsuarios})
    }

    const buscarCliente =  async (buscar) => {
        frmAgregaSumilla.setFieldsValue({'txtDepartamento':''});
        await fetch(
            `${servidorAPI}filtroUsuarios/` + buscar.toUpperCase())
            .then(async response => {
                let resultado = await response.json();
                if (response.status === 201){
                    let options = await resultado.data.map(item => ({value: `${item.id}${item.empleado}`, 
                    label:
                    <div>
                        {item.tipo === 'I' ? <div><IoPersonOutline style={{color:"#faad14"}}/>{item.empleado}</div>
                        :<div><IoExitOutline style={{color:"purple"}}/>{item.empleado} </div>}
                        <HiOutlineOfficeBuilding/>{item.departamento}
                    </div>
                    ,
                    data: item}));
                    setClientesFiltrados(options);
                }
            });
    }

    const seleccionarCliente = async(value, options) => {
        console.log("seleccionado", options);
        setSumillaActual({...sumillaActual,
            sumiIdUsuarioDestino: options.data.usuario,
            sumiUsuarioDestino: options.data.empleado,
            sumiIdDpto: options.data.departamentoId,
            sumiDptoDestino: options.data.departamento
        })
        frmAgregaSumilla.setFieldsValue({'txtDepartamento':options.data.departamento});
        frmAgregaSumilla.setFieldsValue({'txtUsuario':options.data.empleado});
    }


    return (
        <Card title="Oficio"
              size="small"
              extra={<Link to={{pathname: `/oficios`, filtro:location?.filtro}}><Button icon={<IoArrowBackOutline style={{marginTop:'2px'}} />} size="small" ><span>Regresar</span></Button></Link>}
        >
            <Skeleton loading={loading}>
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

                    {/* <Descriptions bordered size="small">
                        <Descriptions.Item label="Registro" span={3}>{`${oficio?.anio} - ${oficio?.registroDpto}`} </Descriptions.Item>
                        <Descriptions.Item label="Oficio" span={3}>{`${oficio?.tipoOficio} - ${oficio?.anio} - ${oficio?.digitos}`} </Descriptions.Item>
                        <Descriptions.Item label="Remitente" span={3}>
                        <div>
                                {oficio?.tipoDocumento === "I" ? <div><FontAwesomeIcon style={{color:"#faad14"}}  icon={faUser}/> {` ${oficio?.usuarioOrigen}`}</div>
                                : <div><FontAwesomeIcon style={{color:"purple"}} icon={faSignInAlt}/> {` ${oficio?.usuarioOrigen} - ${oficio?.dptoOrigen}`}</div>
                                }
                        </div>
                        </Descriptions.Item>
                        <Descriptions.Item label="Destinatario" span={3}>{oficio?.usuarioDestino} </Descriptions.Item>
                        <Descriptions.Item label="Asunto" span={3}><TextArea style={{backgroundColor:"#daedff", border:"1px solid #afd8ff", color:"black"}} disabled rows="3" value={oficio?.asunto}></TextArea> </Descriptions.Item>
                        <Descriptions.Item label="Observacion" span={3}><TextArea style={{backgroundColor:"white", border:"1px solid #afd8ff", color:"black"}} disabled rows="2" value={oficio?.observacion}></TextArea> </Descriptions.Item>
                    </Descriptions> */}
                </Col>
                <Col span={6}>
                <Descriptions bordered size="small">
                        <Descriptions.Item label="Ingresado :" span={3}>{`${oficio?.usuario}`} </Descriptions.Item>
                        <Descriptions.Item label="Fecha ingreso:" span={3}>{`${moment(oficio?.fechaIngreso).format("DD/MM/YYYY")}`} </Descriptions.Item>
                </Descriptions>
                </Col>
            </Row>
            </Form>
            <Row>
                <Col span={18}>
                <Form.Item label="Observacion" name="txtObservacion" labelCol={{span: 3}}>
                    <TextArea style={{backgroundColor:"white", border:"1px solid #afd8ff", color:"black"}} disabled rows="2" ></TextArea>
                    </Form.Item>

                </Col>
                <Col span={6}>
                </Col>

            </Row>
            <Row>
                <Col span={24}>
                <Tabs defaultActiveKey="1" type="card" size="small">
                    <TabPane tab="Sumillas" key="1">
                        <Row>
                        <Col span={24}>
                            <Space style={{marginBottom: "5px"}}>
                                <Button icon={<FontAwesomeIcon icon={faPlus} style={{marginRight:"4px"}} ></FontAwesomeIcon>} onClick={clickSumilla} size="small">Sumilla</Button>
                                <span style={{fontSize:"12px", marginLeft:"25px"}}>Sumilla directa</span>
                                {departamentos.map( item => {
                                    return (
                                        <Tooltip key={item.corrIdDepartamento} title={<span style={{fontSize:"11px", textTransform: "capitalize"}}>{item.departamento}</span>}>
                                            <Button type="default" size="small" style={{background: "#e0e0e0"}} onClick={()=> clickSumillaDirecta(item)} >
                                                {item.siglas}
                                            </Button>
                                        </Tooltip>)
                                })}
                            </Space>
                            <Table dataSource={sumillas} size="small" pagination={false} loading={loading} rowKey="sumiIdSecRegistro" > 
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
                                <Column width={25} render={rowData => 
                                    <Popconfirm
                                        disabled={rowData?.registroContesta ? true : false}
                                        title="¿Seguro desea eliminar esta sumilla?"
                                        okButtonProps={{loading: confirmBorrar}}
                                        onConfirm={()=> deleteSumilla(rowData.sumiIdSecRegistro)}
                                        onCancel={() => console.log("no")}
                                        okText="Si"
                                        cancelText="No"
                                    >
                                        <Button type="text" disabled={rowData?.registroContesta ? true : false}><IoTrashOutline style={{fontSize:"15px"}} /></Button> 
                                    </Popconfirm>}
                                >

                                </Column>
                                <Column width={25} render={rowData => 
                                    <Button type="text" onClick={() => editarSumilla(rowData)} disabled={rowData?.registroContesta ? true : false}>
                                        <IoPencil style={{fontSize:"15px"}} />
                                    </Button>
                                }
                                >
                                </Column>
                            </Table>       
                        </Col>
                        </Row>

                    </TabPane>
                    <TabPane key="2"
                        tab={<div>
                                Gerente Contesta
                                {oficio?.gerContesta?.length > 0 && <Badge offset={[3,0]} size="small" style={{backgroundColor:"green", fontSize: "11px"}} count={oficio?.gerContesta?.length}></Badge> }
                            </div>}
                    >
                        <Table dataSource={oficio.gerContesta} size="small" pagination={false} loading={loading} rowKey="gerIdSecRegistro" > 
                            <Column title="Oficio" width={120} 
                                        render={rowData => (`${rowData.gerTipoOficio} - ${rowData.gerAnio} - ${rowData.gerDigitos}`)}/>
                            <Column title="FechaContesta" key="gerFechaContesta" width={50} 
                                        render={rowData => (moment(rowData.gerFechaContesta).format("DD/MM/YYYY"))}/>
                            <Column title="Contestacion" dataIndex="gerContestacion" key="gerContestacion"/>
                            
                        </Table>
                    </TabPane>
                </Tabs>
                </Col>
            </Row>
            <Modal title="Agregar sumilla"
                visible={visAgregaSumilla}
                onCancel={() => {console.log("cancelar");setVisAgregaSumilla(false)}}
                onOk={() => aceptarSumilla()}
                width={800}
                forceRender
            >
                <Form layout="vertical" form={frmAgregaSumilla}>
                    <Row>
                        <Col span={18}>
                            <Form.Item label="Usuario" name="txtUsuario" 
                            rules={[{required:true, message:"Ingrese un usuario"}]}
                            >
                                <AutoComplete
                                autoFocus={true}
                                onSearch={buscarCliente}
                                options={clientesFiltrados}
                                notFoundContent={<Spin/>}
                                onSelect={(value, options) => seleccionarCliente(value, options)}
                                style={{width: "100%"}}
                                disabled={!nuevaSumilla}
                                >
                                <Input prefix={<IoPersonOutline></IoPersonOutline>}></Input>
                                </AutoComplete>
                            </Form.Item>
                            <Form.Item label="Departamento" name="txtDepartamento"
                            rules={[{required:true, message:"Debe buscar un usuario y su departamento"}]}
                            >
                                <Input prefix={<HiOutlineOfficeBuilding/>} disabled ></Input>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <div style={{marginLeft:"20px"}}>
                            <Descriptions layout="vertical">
                                <Descriptions.Item span={3} label="Ingresado">{moment(sumillaActual.fechaSumilla).format("DD/MM/YYYY")}</Descriptions.Item>
                            </Descriptions>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item label="Sumilla" name='txtSumilla'
                                rules={[{required:true, message:"Ingrese texto en sumilla"}]}
                            >
                                <Input.TextArea rows="3"></Input.TextArea>
                            </Form.Item>
                            <Form.Item label="Estado" name="sltEstadoUsuarios" initialValue='E'>
                                <Select style={{width:"50%"}} >
                                    {estadoUsuarios.map(item => <Select.Option key={item.id} value={item.id}>{item.estado}</Select.Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
            </Skeleton>
        </Card>
    )
}

export default Oficio
