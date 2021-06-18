import React, {useState, useEffect}  from "react";
import {  useParams } from "react-router-dom";
import { Row, Col, Card, Table, Tag, Button, notification, Badge, Space, Descriptions,  
         Tabs, Tooltip, Form, Input, Modal, Select, AutoComplete, Spin, Popconfirm,
        Skeleton } from 'antd';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignInAlt, faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import { IoArrowRedoOutline, IoArrowUndoOutline, IoCalendarClearOutline, IoDocumentTextOutline, 
         IoPersonOutline, IoExitOutline, IoTrashOutline, IoCreateOutline, IoPencil } from 'react-icons/io5'
import { HiOutlineOfficeBuilding } from 'react-icons/hi';
import TextArea from "antd/lib/input/TextArea";
import moment from 'moment';




const Oficio = () => {
    console.log("Inicio");
    const [oficio, setOficio] = useState({})
    const [loading, setLoading] = useState(true);
    const [departamentos, setDepartamentos] = useState([]);
    const [estadoUsuarios, setEstadoUsuarios] = useState([]);
    const [visAgregaSumilla, setVisAgregaSumilla] = useState(false);
    const [sumillaPresioanada, setSumillaPresionada] = useState({});
    const [sumillas, setSumillas] = useState([]);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState({idUsuario: '', usuario:'', departamentoId: '', departamento:''});
    const [frmAgregaSumilla]  = Form.useForm();
    const [clientesFiltrados, setClientesFiltrados] = useState([]);
    const [valBuscarCliente, setValBuscarCliente]=useState({});
    const [confirmBorrar, setConfirmBorrar]=useState(false);
    const [edicionSumilla, setEdicionSumilla]=useState(false);
    const [sumillaAEditar, setSumillaAEditar]=useState(null);
    const [sumillaActual, setSumillaActual]=useState({
        anioContesta: null,
        contestacion: null,
        diasEspera: null,
        digitosContesta: null,
        estadoSumilla: null,
        fechaSumilla: null,
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

    const servidorAPI = process.env.REACT_APP_API_URL;
    const params = useParams();

    const { Column } = Table;
    const {TabPane} = Tabs;

    useEffect( () => {
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

    const clickSumillaDirecta = (item) => {
        setEdicionSumilla(false);
        setSumillaPresionada(item);
        setVisAgregaSumilla(true);
        setUsuarioSeleccionado({
            idUsuario: item.usuario, 
            usuario: item.empleado, 
            departamentoId: item.corrIdDepartamento, 
            departamento:item.departamento
        })
        setSumillaActual({...sumillaActual,
            sumiIdUsuarioDestino: item.usuario,
            sumiUsuarioDestino: item.empleado,
            sumiIdDpto: item.corrIdDepartamento,
            sumiDptoDestino: item.departamento
        });        
        frmAgregaSumilla.setFieldsValue({'txtUsuario':item.empleado})
        frmAgregaSumilla.setFieldsValue({'txtDepartamento':item.departamento})
    }

    const clickSumilla = () => {
        console.log("click");
        setEdicionSumilla(false);
        setVisAgregaSumilla(true);
    }

    const aceptarSumilla = async () =>{
        frmAgregaSumilla.validateFields().then( async values => {
            console.log("Ok a grabar", frmAgregaSumilla.getFieldValue('sltEstadoUsuarios'));
            setVisAgregaSumilla(false);
            // let registro ={
            //     idRegistro: oficio.id,
            //     fechaEnvio: moment(),
            //     idUsuarioDestino: usuarioSeleccionado.idUsuario,
            //     idDptoDestino: usuarioSeleccionado.departamentoId,
            //     estadoUsuarios: frmAgregaSumilla.getFieldValue('sltEstadoUsuarios'),
            //     usuarioDestino: usuarioSeleccionado.usuario,
            //     dptoDestino: usuarioSeleccionado.departamento,
            //     sumilla: frmAgregaSumilla.getFieldValue('txtSumilla'),
            //     idRegistro2: oficio.id,
            //     idSecRegistro2: oficio.idSecRegistro,
            //     tipo: 'S',
            //     idSecRegistro: sumillaAEditar
            // };
            let registro = {...sumillaActual, 
                sumilla: frmAgregaSumilla.getFieldValue('txtSumilla'),
                sumiEstadoUsuarios: frmAgregaSumilla.getFieldValue('sltEstadoUsuarios'),
                idRegistro2: oficio.id,
                idSecRegistro2: oficio.idSecRegistro,
                idRegistro: oficio.id,
                fechaSumilla: moment()
            }
            console.log("registro", registro);
            edicionSumilla ? 
                  updateSumilla(registro)
                : insertaSumilla(registro);
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
                let estado = '';
                let cambio = [...sumillas];
                //registro.estadoUsuarios === "S" ? estado = "EN ESPERA" : estado = "ENVIADO";
                registro.idSecRegistro= data.data;
                registro.estadoSumilla = estadoUsuarios.filter(item => item.id === registro.sumiEstadoUsuarios)[0].estado   
                // let sumilla = {
                //     anioContesta: null,
                //     contestacion: null,
                //     diasEspera: 0,
                //     digitosContesta: null,
                //     estadoSumilla:estado,
                //     fechaSumilla: Date.now(),
                //     observacion: null,
                //     registroContesta: null,
                //     siglas: null,
                //     sumiDptoDestino: registro.dptoDestino,
                //     sumiEstadoUsuarios: registro.estadoUsuarios,
                //     sumiFechaContesta: null,
                //     sumiFechaVencimiento: null,
                //     sumiIdDpto: registro.idDptoDestino,
                //     sumiIdSecRegistro: data.data,
                //     sumiIdUsuarioDestino: registro.idUsuarioDestino,
                //     sumiIdRegistroDpto: null,
                //     sumiUsuarioDestino: registro.usuarioDestino,
                //     sumilla: registro.sumilla,
                //     sumillado: "S"
                // }
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
            const data = await response.json();
            if (response.status === 201){
                let cambio = [...sumillas];
                console.log("a cambiar", cambio);
                console.log("nuevo", cambio);
                cambio = cambio.map( item => item.sumiIdSecRegistro == registro.idSecRegistro ? {...item, sumilla: registro.sumilla, sumiEstadoUsuarios: registro.estadoUsuarios}:item);
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
                let nuevas = cambio.filter(item => item.sumiIdSecRegistro!= pid);
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
        console.log('editar', item);
        setEdicionSumilla(true);
        //setSumillaPresionada(item);
        setVisAgregaSumilla(true);
        setSumillaAEditar(item.sumiIdSecRegistro);
        // setUsuarioSeleccionado({
        //     idUsuario: item.usuario, 
        //     usuario: item.empleado, 
        //     departamentoId: item.corrIdDepartamento, 
        //     departamento:item.departamento
        // })
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
                    console.log("encontrados", resultado.data);
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
        setUsuarioSeleccionado({
            idUsuario: options.data.usuario, 
            usuario: options.data.empleado, 
            departamentoId: options.data.departamentoId, 
            departamento:options.data.departamento
        })

        frmAgregaSumilla.setFieldsValue({'txtDepartamento':options.data.departamento});
        frmAgregaSumilla.setFieldsValue({'txtUsuario':options.data.empleado});
        //this.formRef.current.setFieldsValue({txtContratista: options.data.nomComercial?options.data.nomComercial:`${options.data.apellido} ${options.data.nombre}`, txtContratistaEmail: options.data.email});
    }


    return (
        <Card title="Oficio">
            <Skeleton loading={loading}>
            <Row>
                <Col span={16}>
                    <Descriptions bordered size="small">
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
                    </Descriptions>
                </Col>
                <Col span={8}>
                <Descriptions bordered size="small">
                        <Descriptions.Item label="Ingresado :" span={3}>{`${oficio?.usuario}`} </Descriptions.Item>
                        <Descriptions.Item label="Fecha ingreso:" span={3}>{`${moment(oficio?.fechaIngreso).format("DD/MM/YYYY")}`} </Descriptions.Item>
                    </Descriptions>
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
                                                    {/* <FontAwesomeIcon icon={faShare} style={{size:"10px",  marginRight:"5px", color:"#a97817"}}></FontAwesomeIcon> */}
                                                    <IoArrowRedoOutline style={{size:"10px",  marginRight:"5px", color:"#a97817"}}></IoArrowRedoOutline>
                                                    {`${rowData.sumilla} `}
                                                </div>
                                                {rowData.registroContesta &&
                                                <div style={{fontSize:'11px', color:"#004c9e", marginTop:"8px",  marginLeft:"15px", borderTop:"1px dotted #c0d5ec" }}>
                                                    <div >
                                                        {/* <FontAwesomeIcon icon={faReply} style={{size:"10px",  marginRight:"5px"}}></FontAwesomeIcon> */}
                                                        <IoArrowUndoOutline style={{size:"10px",  marginRight:"5px"}}/>
                                                        <span >
                                                        {`Contesta: ${rowData.registroContesta}`}  
                                                        </span>
                                                        {/* <FontAwesomeIcon icon={faCalendar} style={{size:"10px", marginLeft:"15px",  marginRight:"5px"}}></FontAwesomeIcon> */}
                                                        <IoCalendarClearOutline style={{fontSize:"12px", marginLeft:"15px",  marginRight:"5px"}}/>
                                                        {moment(rowData.sumiFechaContesta).format('DD/MM/YYYY')}
                                                        {/* <FontAwesomeIcon icon={faCopy} style={{size:"10px",  marginLeft:"15px", marginRight:"5px"}}></FontAwesomeIcon> */}
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
                                {/* <Column title="Contestación"  width={250}  
                                    render={
                                        rowData => {return(
                                            rowData.registroContesta &&
                                            <div>
                                                <span > 
                                                            {`${rowData.contestacion ? rowData.contestacion : ''  } `}
                                                </span>
                                                <div style={{fontSize:'11px', color:"#096dd9" }}>
                                                    <FontAwesomeIcon icon={faReply} style={{size:"10px",  marginRight:"5px"}}></FontAwesomeIcon>
                                                    <span >
                                                    {`Contesta: ${rowData.registroContesta} con fecha ${moment(rowData.sumiFechaContesta).format('DD/MM/YYYY')}`}
                                                    </span>
                                                </div>

                                            </div>
                                        )}
                                    }
                                /> */}
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
                                onChange={(valor) =>{ setValBuscarCliente(valor)  }}
                                style={{width: "100%"}}
                                disabled={edicionSumilla}
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
                                <Descriptions.Item span={3} label="Usuario">PGARCIA</Descriptions.Item>
                                <Descriptions.Item span={3} label="Ingresado">{moment().format("DD/MM/YYYY")}</Descriptions.Item>
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
