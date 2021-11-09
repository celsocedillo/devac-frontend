import React, {useState, useEffect, useContext}  from "react";
import moment from 'moment';
import { Row, Col, Card, Table, notification, Avatar, Popover, Badge, Drawer, Button, Form, Input, Descriptions, Tag, Divider } from 'antd';
import TextArea from "antd/lib/input/TextArea";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearchPlus, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { IoArrowRedoOutline, IoArrowUndoOutline, IoCalendarClearOutline, IoDocumentTextOutline, 
    IoPersonOutline, IoChevronForwardCircleOutline,
    IoMailOutline, IoPersonCircleOutline } from 'react-icons/io5'
import { SiMicrosoftexcel } from "react-icons/si";

import UserContext from "../../contexts/userContext";
import OficioVista from "./components/OficioVista";

require('dotenv').config();

function EnEspera(){

    const servidorAPI = process.env.REACT_APP_API_URL;
    const gerencia_direccion_id = process.env.GERENCIA_DIRECCION_ID;

    const { Column } = Table;

    const [lista, setLista] = useState(null);

    const [loading, setLoading] = useState(true);
    const [demorados, setDemorados] = useState(0);
    const [enEspera, setEnEspera] = useState();
    const [showDetalle, setShowDetalle] = useState(false);
    const [oficio, setOficio] = useState({});
    const [sumillas, setSumillas] = useState([]);
    const {usuario} = useContext(UserContext);
    const {apiHeader} = useContext(UserContext);
    const [oficioId, setOficioId] = useState();

    const [frmOficio]  = Form.useForm();
    //const [fetchHeader, setFetchHeader] = useState();

    
    useEffect(() => {
    
        async function obtenerData()  {
            setLoading(true);
            try {           
                //const response = await fetch(`${servidorAPI}oficiosEnEspera`);
                //console.log('usuarioenespe', usuario);
                let pathurl;

                //Si el usuario es gerencia, le presenta todos los oficios de sumilla de todas las areas
                //console.log('header', fetchHeader);
                // gerencia_direccion_id === usuario.direccionId
                //     ? pathurl = `${servidorAPI}oficiosEnEspera` 
                //     : pathurl = `${servidorAPI}oficiosEnEsperaDireccion/${usuario.direccionId}`
                pathurl = `${servidorAPI}oficiosEnEspera`
                const response = await fetch(pathurl, {method: 'GET', headers: apiHeader});
                const data = (await response.json());
                if (response.status === 201){
                    setLista(data.data);
                    setDemorados((data.data.filter( a => a.diasEspera > 6)).length);
                    setEnEspera(data.data.length - (data.data.filter( a => a.diasEspera > 6)).length)
                }else{
                    throw new Error (`[${data.error}]`)                    
                }            
                setLoading(false);
        
            } catch (error) {
                notification['error']({
                    message: 'Error',
                    description: `Error al cargar las sumillas enviadas  ${error}`
                  });    
            }
       }
       usuario &&  obtenerData();
    }, [usuario]);

    const handleShowDetalle = async (id) => {
        console.log('al detalle', id);
        setOficioId(id);
        setShowDetalle(true);
        // try {           
        //     //setLoading(true);
        //     const response = await fetch(`${servidorAPI}oficio/${id}`, {method:'GET', headers: apiHeader});
        //     const data = (await response.json());
        //     if (response.status === 201){
        //         console.log("oficio", data.data);
        //         setOficio(data.data);
        //         setShowDetalle(true);
        //         llenaFormulario(data.data);
        //     }else{
        //         throw new Error (`[${data.error}]`)                    
        //     }            
        //     //setLoading(false);
        //     setSumillas(data.data.sumillas);
        // } catch (error) {
        //     notification['error']({
        //         message: 'Error',
        //         description: `Error al cargar los oficios ${error}`
        //       });    
        // }
    }

    const llenaFormulario = (datos) =>{
        frmOficio.setFieldsValue({'txtRegistro': `${datos.anio}- ${datos.registroDpto}`})
        frmOficio.setFieldsValue({'txtOficio': `${datos?.tipoOficio} - ${datos?.anio} - ${datos?.digitos}`})
        frmOficio.setFieldsValue({'txtRemitente': ` ${datos.usuarioOrigen} - ${datos.dptoOrigen}`})
        frmOficio.setFieldsValue({'txtDestinatario': datos.usuarioDestino})
        frmOficio.setFieldsValue({'txtAsunto': datos.asunto})
        frmOficio.setFieldsValue({'txtObservacion': datos.observacion})
    }

    const handleClickExcel = async () => {
        const response = await fetch(`${servidorAPI}oficiosEnEsperaExcel`, {method: 'GET', headers: apiHeader});        
        response.blob().then(blob => {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = "sumillasEspera.xlsx";
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();    
            a.remove();  //afterwards we remove the element again            
        });
    }


    
    return(
        <Card title="Lista de oficios">
            <Row style={{backgroundColor:"#ececec"}}>
                <Col span={2} style={{textAlign:"center"}}>
                    <Card>
                        <div>
                        <Badge count={lista?.length} style={{backgroundColor: "#40a9ff"}}>
                        </Badge>
                        </div>
                        Sumillas
                    </Card>
                </Col>
                <Col span={2} style={{textAlign:"center"}}>
                    <Card>
                        <div>
                        <Badge count={demorados}>
                        </Badge>
                        </div>
                        Demorados
                    </Card>
                </Col>
                <Col span={2} style={{textAlign:"center"}} >
                    <Card>
                    <div>
                        <Badge count={enEspera} style={{backgroundColor: "green"}}>
                        </Badge>
                        </div>
                        En espera
                    </Card>
                </Col>
                <Col span={18} style={{textAlign:"end", alignContent:""}} >
                    <Button style={{marginTop:"25px"}} size="small" icon={<SiMicrosoftexcel/>} onClick={() => handleClickExcel()}>Excel</Button>
                </Col>

            </Row>

            <Table dataSource={lista} size="small" pagination={false} loading={loading} rowKey="id" > 
            <Column title="Id" dataIndex="id" key="id" width={20} />
            <Column title="Año" dataIndex="anio" key="anio" width={30} />
            <Column title="Registro" dataIndex="registroDepartamento" key="registroDepartamento" width={30} />
            <Column title="Fecha" key="fechaIngreso" width={30} 
                sorter={(a, b) => moment(a.fechaIngreso).unix() - moment(b.fechaIngreso).unix()}
                render={rowData => (moment(rowData.fechaIngreso).format("DD/MM/YYYY"))}/>
            <Column title="Asunto" width={80} 
                render={rowData => { return(
                <div>
                    <span style={{whiteSpace:"nowrap"}}> 
                        {rowData.asunto.length>50 ? 
                        <div> 
                                {`${rowData.asunto.substring(0,49)} `}
                                <Popover
                                    content={rowData.asunto}
                                >
                                    <FontAwesomeIcon style={{border:"solid 1px #d8d8d8", backgroundColor:"#feffb0", paddingTop:"1px", height:"8px"}} icon={faEllipsisH}></FontAwesomeIcon>
                                </Popover>
                        </div>
                        :rowData.asunto}                            
                    </span>
                    <div style={{fontSize:"11px"}}>
                        <span style={{color:"gray"}}>
                            Remitente: 
                        </span>
                        <span style={{color:"#629db1"}}>
                            {`${rowData.usuarioOrigen}, `}
                        </span>
                        <span style={{color:"#5a9e5a"}}>
                            {rowData.departamentoOrigen}
                        </span>
                    </div>
                </div>
            )}}
            />
            <Column title="FechaSumilla" key="fechaSumilla" width={30} 
                sorter={(a, b) => moment(a.fechaSumilla).unix() - moment(b.fechaSumilla).unix()}
                render={rowData => (moment(rowData.fechaSumilla).format("DD/MM/YYYY"))}/>

            <Column title="Direccion" 
                sorter={(a, b) => a?.siglas.localeCompare(b?.siglas)}
                render={rowData => {return(
                    <div>
                        <Avatar style={{ color: '#fde3cf', backgroundColor: '#f56a00' }}>
                            {rowData.siglas}
                        </Avatar> 
                    </div>
                )}}
            />

            <Column title="Sumillado" 
                render={rowData => {return(
                    <div>
                        {rowData.sumillaUsuarioDestino}
                    </div>
                )}}
            />
            <Column title="Sumilla"  width={80}
                render={
                    rowData => {return(
                        <div>
                            <span style={{whiteSpace:"nowrap"}}> 
                                {rowData.sumilla.length>50 ? 
                                <div> 
                                        {`${rowData.sumilla.substring(0,49)} `}
                                        <Popover
                                            content={rowData.sumilla}
                                        >
                                            <FontAwesomeIcon style={{border:"solid 1px #d8d8d8", backgroundColor:"#feffb0", paddingTop:"1px", height:"8px"}} icon={faEllipsisH}></FontAwesomeIcon>
                                        </Popover>
                                </div>
                                :rowData.sumilla}                            
                            </span>
                        </div>
                    )}
                }
            />
            <Column title="Espera" width={30} 
            sorter={(a, b) => a.diasEspera - b.diasEspera}
            render={rowData => {
                return(
                    rowData.diasEspera >= 5 ?
                    <Badge count={rowData.diasEspera} style={{backgroundColor:"red"}} overflowCount="999"></Badge>
                    :
                    <Badge count={rowData.diasEspera} style={{backgroundColor:"green"}}></Badge>
                )
            }}
            />                    

            <Column title="" width={35} align="center" 
                     render={ rowData => 
                       <Button type='text' onClick={() => handleShowDetalle(rowData.idRegistro)} ><FontAwesomeIcon icon={faSearchPlus}></FontAwesomeIcon>
                       </Button> 
                     }>
            </Column>
            {/* <Column title="Estado" key="estado" width={50} sorter={(a, b) => a.estado.localeCompare(b.estado)} 
                onFilter= {(value, record) => record.estado.indexOf(value) === 0}
                render={rowData => {
                return(
                    (
                        rowData.sumillaEstado === "S" ?
                        <Tag  color="red" style={{fontSize: '11px', lineHeight: '15px'}} >En espera</Tag>
                        :
                        <Tag style={{fontSize: '11px', lineHeight: '15px'}} >Ingesado</Tag>
                    )
                    )
                }
            }/> */}
       </Table>                 


            {/* <ModalOficio show={showModalOficio} onClose={closeModalOficio}></ModalOficio> */}

            <Drawer 
                title='Oficio'
                width={850}
                onClose={()=> setShowDetalle(false)}
                visible={showDetalle}
            >
                <OficioVista oficioId={oficioId}/>
            </Drawer>
        </Card>
     );

};

export default EnEspera;