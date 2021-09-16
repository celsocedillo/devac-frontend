import React, {useState, useEffect, useContext}  from "react";
import moment from 'moment';
import { Row, Col, Card, Table, notification, Radio, Popover, Badge, Drawer, Button, Form, Input, Descriptions, Tag, Divider } from 'antd';
import TextArea from "antd/lib/input/TextArea";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearchPlus, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { IoArrowRedoOutline, IoArrowUndoOutline, IoCalendarClearOutline, IoDocumentTextOutline, 
    IoPersonOutline, IoChevronForwardCircleOutline, 
    IoMailOutline, IoPersonCircleOutline, IoSwapHorizontalOutline, IoCopyOutline } from 'react-icons/io5'


import UserContext from "../../contexts/userContext";
import OficioVista from "./components/OficioVista";

require('dotenv').config();

function BandejaSumillas(){

    const servidorAPI = process.env.REACT_APP_API_URL;
    //const gerencia_direccion_id = process.env.GERENCIA_DIRECCION_ID;

    const { Column } = Table;

    const [lista, setLista] = useState(null);
    const [loading, setLoading] = useState(true);
    //const [demorados, setDemorados] = useState(0);
    const [enEspera, setEnEspera] = useState();
    const [showDetalle, setShowDetalle] = useState(false);
    const [oficio, setOficio] = useState({});
    const [sumillas, setSumillas] = useState([]);
    const [nombresFiltro, setNombreFiltro] = useState([]);
    const [filtroInfo, setFiltroInfo] = useState(null);
    const [paginacionManual, setPaginacionManual] = useState(true);
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalRows, setTotalRows] = useState(0);    
    const [estadoFiltroActual, setEstadoFiltroActual] = useState('T');
    const [oficioId, setOficioId] = useState();


    const {usuario} = useContext(UserContext);
    const {apiHeader} = useContext(UserContext);

    const [frmOficio]  = Form.useForm();
    
    
    
    useEffect(() => {
       async function obtenerData() {
        await obtenerSumillas('T', 1);
       }
       if (usuario){
        obtenerData();
        setPaginacionManual(true);
       }

    }, [usuario]);

    // useEffect(()=>{
    //     !enEspera && setEnEspera(lista?.filter(a => a.sumillaEstado ==='S').length)
    // }, [lista])

    const obtenerSumillas = async (xestado, pagina) => {
        try{
            setLoading(true);
            const response = await fetch(`${servidorAPI}oficiosSumillaDireccion/${usuario.direccionId}/${xestado}/${pagina}`, {method: 'GET', headers: apiHeader});
            const data = (await response.json());
            if (response.status === 201){
                setLista( data.data.data);
                setTotalRows(data.data.totalRows);
                if (xestado === 'S'){
                    let nombres=[];
                    data.data.data.filter(item =>{
                        var i = nombres.findIndex(x => (x.text === item.sumillaUsuarioDestino ));
                        if(i <= -1){
                            nombres.push({value: item.sumillaIdUsuarioDestino, text: item.sumillaUsuarioDestino});
                        }
                        return null;
                    })
                    setNombreFiltro(nombres);
                }else if(xestado === 'T'){
                    setEnEspera(data.data.totalEnEspera);
                }else {
                    setNombreFiltro([]);
                    setFiltroInfo(null);
                }
            }else{
                throw new Error (`[${data.error}]`)                    
            }            
            setLoading(false);
        }catch(error){
            notification['error']({
                message: 'Error',
                description: `Error al cargar los contratos ${error}`
              });    
        }
    }

    const handleShowDetalle = async (id) => {
        console.log('al detalle', id);
        setOficioId(id);
        setShowDetalle(true);


        // try {           
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

    const handleChangeEstado = async (e) => {
        let pagina = 0;
        e.target.value === 'S' ? pagina = 0 : pagina = 1
        e.target.value === 'S' ? setPaginacionManual(false) : setPaginacionManual(true)
        setEstadoFiltroActual(e.target.value);
        setPaginaActual(1);
        await obtenerSumillas(e.target.value, pagina);
    }

    const handleTableChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        if (paginacionManual) {
            setPaginaActual(pagination.current);
            obtenerSumillas(estadoFiltroActual, pagination.current)
        }
        setFiltroInfo(filters);
      };


    
    return(
        <Card title="Oficios Sumillados" >
            <Radio.Group buttonStyle='solid' defaultValue={estadoFiltroActual} onChange={handleChangeEstado} disabled={loading}>
                <Radio.Button value='T'>Todos</Radio.Button>
                <Radio.Button value='S'>Por responder ({enEspera})</Radio.Button>
                <Radio.Button value='C'>Contestados</Radio.Button>
                <Radio.Button value='O'>Informados</Radio.Button>
            </Radio.Group>
            <Table dataSource={lista} size="small" pagination={ paginacionManual ? {current: paginaActual,total: totalRows, showSizeChanger: false, pageSize: 20} : {pagination: true}} loading={loading} rowKey="id" onChange={handleTableChange} 
            > 
            <Column width={25}
                render={rowData => {
                    let icono;
                     if (rowData.sumillaEstado === "S" ){
                        rowData.diasEspera >= 5 ?
                        icono = <IoSwapHorizontalOutline style={{color:'red', fontSize: '18px'}} />
                        :
                        icono = <IoSwapHorizontalOutline style={{color:'green', fontSize: '18px'}} />
                     }else if(rowData.sumillaEstado === "C" ){
                        icono = <IoArrowUndoOutline style={{color: 'blue', fontSize: '18px'}}/>
                     }else {
                        icono = <IoCopyOutline style={{fontSize: '17px'}}/>
                     }
                     return (<div>{icono}</div>);
                }
                }
             />

            <Column title="FechaSumilla" key="fechaSumilla" width={30} 
                sorter={(a, b) => moment(a.fechaSumilla).unix() - moment(b.fechaSumilla).unix()}
                render={rowData => (moment(rowData.fechaSumilla).format("DD/MM/YYYY"))}/>

            <Column title="Sumillado" 
                filterIcon={nombresFiltro.length > 0 ? false : true}
                key='sumillado'
                filteredValue={filtroInfo?.sumillado || null}
                filters={nombresFiltro && nombresFiltro}
                onFilter={(value, record) => record.sumillaIdUsuarioDestino.indexOf(value) === 0}
                render={rowData => {return(
                        <span style={{textTransform: 'capitalize'}}>{rowData.sumillaUsuarioDestino?.toLowerCase()}</span>
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
                        <span style={{color:"#629db1", textTransform:'capitalize'}}>
                            {`${rowData.usuarioOrigen.toLowerCase()}, `}
                        </span>
                        <span style={{color:"#5a9e5a", textTransform:'capitalize'}}>
                            {rowData.departamentoOrigen.toLowerCase()}
                        </span>
                    </div>
                </div>
            )}}
            />

            <Column title="Espera" width={30} 
            sorter={(a, b) => a.diasEspera - b.diasEspera}
            render={rowData => {
                return(
                    rowData.sumillaEstado === 'S' && (
                        rowData.diasEspera >= 5 ?
                        <Badge count={rowData.diasEspera} style={{backgroundColor:"red", fontSize: '8px'}} overflowCount="999"></Badge>
                        :
                        <Badge count={rowData.diasEspera} style={{backgroundColor:"green"}}></Badge>
                    )
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

export default BandejaSumillas;