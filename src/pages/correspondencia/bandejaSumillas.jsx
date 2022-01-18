import React, {useState, useEffect, useContext}  from "react";
import moment from 'moment';
import { Row, Col, Card, Table, notification, Radio, Popover, Badge, Drawer, Button, Form, Input,  Select, Space, DatePicker } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearchPlus, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import {  IoArrowUndoOutline, IoSwapHorizontalOutline, IoCopyOutline, IoSearch } from 'react-icons/io5'
import { SiMicrosoftexcel } from "react-icons/si";


import UserContext from "../../contexts/userContext";
import OficioVista from "./components/OficioVista";

require('dotenv').config();

function BandejaSumillas(){

    //const servidorAPI = process.env.REACT_APP_API_URL;
    const servidorAPI = `${process.env.REACT_APP_API_URL}correspondencia/`;
    //const gerencia_direccion_id = process.env.GERENCIA_DIRECCION_ID;

    const { Column } = Table;
    const { Search } = Input;
    const [frmBuscar] = Form.useForm();
    frmBuscar.setFieldsValue({'txtAnioRegistro': moment().year()})
    const [frmFiltro] = Form.useForm();
    

    const [lista, setLista] = useState(null);
    const [loading, setLoading] = useState(true);
    //const [demorados, setDemorados] = useState(0);
    const [enEspera, setEnEspera] = useState();
    const [showDetalle, setShowDetalle] = useState(false);
    const [nombresFiltro, setNombreFiltro] = useState([]);
    const [filtroInfo, setFiltroInfo] = useState(null);
    const [paginacionManual, setPaginacionManual] = useState(true);
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalRows, setTotalRows] = useState(0);    
    const [estadoFiltroActual, setEstadoFiltroActual] = useState('T');
    const [oficioId, setOficioId] = useState();
    const [filtro, setFiltro] = useState('');
    const [filtroOptions, setFiltroOptions] = useState([]);
    const [filtroValues, setFiltroValues] = useState([]);
    //const [sumillaEncontrada, setSumillaEncontrada] = useState(null);


    const {usuario} = useContext(UserContext);
    const {apiHeader} = useContext(UserContext);

    
    useEffect(() => {
       async function obtenerData() {
        //await obtenerSumillas('T', 1);
        const data = await buscarSumillas('T', 0,0,usuario.departamentoId,null,1);
        console.log('viene');
        console.log(data);
        if (data.data?.length > 0){
            setLista( data.data);
            setTotalRows(data.totalRows);
            setEnEspera(data.totalEnEspera);
            setNombreFiltro([]);
            setFiltroInfo(null);
            setEstadoFiltroActual('T');
        }
        // if (xestado === 'S'){
        //     let nombres=[];
        //     data.data.data.filter(item =>{
        //         var i = nombres.findIndex(x => (x.text === item.sumillaUsuarioDestino ));
        //         if(i <= -1){
        //             nombres.push({value: item.sumillaIdUsuarioDestino, text: item.sumillaUsuarioDestino});
        //         }
        //         return null;
        //     })
        //     setNombreFiltro(nombres);
        // }else if(xestado === 'T'){
        //     setEnEspera(data.data.totalEnEspera);
        // }else {
        //     setNombreFiltro([]);
        //     setFiltroInfo(null);
        // }        
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
            const response = await fetch(`${servidorAPI}oficiosSumillaDireccion/${usuario.direccionId}/${xestado}/${pagina}/0/0`, {method: 'GET', headers: apiHeader});
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
    }

    const handleChangeEstado = async (e) => {
        let pagina = 0;
        //e.target.value === 'S' ? pagina = 0 : pagina = 1
        //e.target.value === 'S' ? setPaginacionManual(false) : setPaginacionManual(true)
        setEstadoFiltroActual(e.target.value);
        setPaginaActual(1);
        //await obtenerSumillas(e.target.value, pagina);
        const data = await buscarSumillas(e.target.value, 0,0,usuario.departamentoId,null,1);
        setLista( data.data);
        setTotalRows(data.totalRows);
        //setEnEspera(data.totalEnEspera);
    }

    const handleTableChange = async (pagination, filters, sorter) => {
        //console.log('Various parameters', pagination, filters, sorter);
        if (paginacionManual) {
            let data;
            setPaginaActual(pagination.current);
            if (!filtro){
                data = await buscarSumillas(estadoFiltroActual, 0,0,usuario.departamentoId,null,pagination.current);
            }else{
                //data = await buscarSumillas(0,0,usuario.departamentoId,filtro,pagination.current);
                data = await buscarSumillas(null,0,0,usuario.departamentoId,filtro,pagination.current);
            }
            setLista( data.data);
        }
        setFiltroInfo(filters);
      };

    
    const handleClickBuscar = async () => {
        const sumillaEncontrada = await buscarSumillas(null,frmBuscar.getFieldValue('txtAnioRegistro'), frmBuscar.getFieldValue('txtRegistro'), usuario.direccionId, null, 0)
        console.log('find', sumillaEncontrada[0]);
        sumillaEncontrada.length > 0 && handleShowDetalle(sumillaEncontrada[0].idRegistro);
    }

    const buscarSumillas = async(pestado, panio, pregistro, pdepartamento, pfiltro, ppagina) => {
        try {
            setLoading(true);
            if (pestado){
                const response = await fetch(`${servidorAPI}oficiosSumillaDireccion/${usuario.direccionId}/${pestado}/${ppagina}/0/0`, {method: 'GET', headers: apiHeader});
                const data = (await response.json());
                if (response.status === 200){
                    setLoading(false);
                    return data
                }else{
                    throw new Error (`[${data.error}]`)                    
                }   
            }

            if (pfiltro){
                const response = await fetch(`${servidorAPI}oficiosSumillaByFiltro/${usuario.departamentoId}/${ppagina}/?${pfiltro}`, {method: 'GET', headers: apiHeader});        
                const data = (await response.json());
                if (response.status === 200){
                    setLoading(false);
                    return data
                }else{
                    throw new Error (`[${data.error}]`)                    
                }   
            }else{
                const response = await fetch(`${servidorAPI}oficiosSumillaDireccion/${pdepartamento}/null/${ppagina}/${panio}/${pregistro}`, {method: 'GET', headers: apiHeader});
                const data = (await response.json());
                if (response.status === 200){
                    setLoading(false);
                    return data.data
                }else{
                    throw new Error (`[${data.error}]`)                    
                }            
            }
            // setLoading(true);
            // const response = await fetch(`${servidorAPI}oficiosSumillaDireccion/${pdepartamento}/null/${ppagina}/${panio}/${pregistro}`, {method: 'GET', headers: apiHeader});
            // const data = (await response.json());
            return null;
        } catch (error) {
            setLoading(false);
            notification['error']({
                message: 'Error',
                description: `Error al buscar las sumillas ${error}`
              });                       
        }
    }    

    const handleClickFiltrar = async (excel) => {
        try {
            let xfiltro = '';
            let xfiltroOptions=[];
            let xfiltroValues=[];
            const fechaInicio = frmFiltro.getFieldValue('txtFecha')?.inicio
            const fechaFin = frmFiltro.getFieldValue('txtFecha')?.fin
            const asunto = frmFiltro.getFieldValue('txtAsunto')
            const oficio = frmFiltro.getFieldValue('txtOficio')

            if (fechaInicio && moment(fechaInicio, 'YYYY-MM-DD').isValid()){
                xfiltro = `fechaDesde=${fechaInicio}`
                xfiltroOptions.push({label:`fecha=${moment(fechaInicio).format('DD-MM-YYYY')}`, value:'1'});
                xfiltroValues.push('1')
            }
            if (fechaFin && moment(fechaFin, 'YYYY-MM-DD').isValid()){
                xfiltro = `${xfiltro}&fechaHasta=${fechaFin}`
                xfiltroOptions.push({label:`al=${moment(fechaFin).format('DD-MM-YYYY')}`, value:'2'})
                xfiltroValues.push('2')
            }
            if (asunto){
                xfiltro = `${xfiltro}&asunto=${encodeURI(asunto)}`  
                xfiltroOptions.push({label:`asunto=${asunto}`, value:'3'})
                xfiltroValues.push('3')
            } 
            if (oficio){
                xfiltro = `${xfiltro}&oficio=${encodeURI(oficio)}`  
                xfiltroOptions.push({label:`oficio=${oficio}`, value:'4'})
                xfiltroValues.push('4')
            }


            if (excel){
                const response = await fetch(`${servidorAPI}oficiosSumillaByFiltroExcel/${usuario.departamentoId}/1/?${xfiltro}`, {method: 'GET', headers: apiHeader});        
                response.blob().then(blob => {
                    var url = window.URL.createObjectURL(blob);
                    var a = document.createElement('a');
                    a.href = url;
                    a.download = "filename.xlsx";
                    document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
                    a.click();    
                    a.remove();  //afterwards we remove the element again                           
                });

            }else{
                setFiltroOptions(xfiltroOptions);
                setFiltroValues(xfiltroValues);
                setLista([]);
                setTotalRows(0);
   
                if (xfiltro.length > 0){
                    const data = await buscarSumillas(null,0,0,usuario.departamentoId,xfiltro,1);
                    if (data.data?.length > 0 ) {
                        setPaginaActual(1);
                        setFiltro(xfiltro);
                        setLista(data.data);
                        setTotalRows(data.totalRows);
                    }
                }
            }

        } catch (error) {
            notification['error']({
                message: 'Error',
                description: `Error al validar los filtros ${error}`
              });                       
        }

    }

    const handleClickExcel = async ()=>{

    }

    const handleClickReset = async () =>{
        setFiltro(null);
        setFiltroValues([])
        setFiltroOptions([]);
        frmFiltro.setFieldsValue({'txtFecha': null})
        frmFiltro.setFieldsValue({'txtFecha': null})
        frmFiltro.setFieldsValue({'txtAsunto': null})
        frmFiltro.setFieldsValue({'txtOficio': null})
        const data = await buscarSumillas('T', 0,0,usuario.departamentoId,null,1);
        if (data.data?.length > 0){
            setLista( data.data);
            setTotalRows(data.totalRows);
            setEnEspera(data.totalEnEspera);
            setNombreFiltro([]);
            setFiltroInfo(null);
            setEstadoFiltroActual('T');
        }
    }

    return(
        <Card title="Oficios Sumillados" >
            <Row>
                <Col span={18}>
                    {
                        !filtro 
                        ?
                        <Radio.Group buttonStyle='solid' defaultValue={estadoFiltroActual} onChange={handleChangeEstado} disabled={loading}>
                            <Radio.Button value='T'>Todos</Radio.Button>
                            <Radio.Button value='S'>Por responder ({enEspera})</Radio.Button>
                            <Radio.Button value='C'>Contestados</Radio.Button>
                            <Radio.Button value='O'>Informados</Radio.Button>
                        </Radio.Group>
                        :
                        <Select size='small' mode='multiple' options={filtroOptions} value={filtroValues}>  
                            
                        </Select>
                    }
                </Col>

                <Col  span={6} style={{marginTop:'2px'}}>
                    <Space align='center'>
                        <Popover title="Filtro de sumillas" trigger="click" 
                            content={
                            <Form form={frmFiltro} layout='vertical'>
                                <Form.Item label="Fecha de sumilla (YYYY-MM-DD)">
                                    <Input.Group compact>
                                        <Form.Item name={['txtFecha', 'inicio']} noStyle >
                                            <DatePicker size='small' placeholder="Fecha inicio" style={{width:'50%'}} size="small"/>
                                        </Form.Item>
                                        <Form.Item name={['txtFecha', 'fin']} noStyle>
                                            <DatePicker size='small' placeholder="Fecha fin" style={{width:'50%'}} size="small"/>
                                        </Form.Item>
                                    </Input.Group>
                                </Form.Item>    
                                <Form.Item name="txtOficio" label="Oficio :" >
                                    <Input size='small'></Input>
                                </Form.Item>                   
                                <Form.Item name="txtAsunto" label="Asunto :" >
                                    <Input size='small'></Input>
                                </Form.Item>                   
                                <Button size='small' onClick={() => handleClickFiltrar(false)}>Filtrar</Button>
                                <Button size='small' onClick={handleClickReset}>Reset</Button>
                                <Button style={{backgroundColor:'#d2e8c7'}} size='small' onClick={() => handleClickFiltrar(true)} icon={<SiMicrosoftexcel/>}> Excel</Button>
                            </Form>
                            } 
                        >
                            <Button size='small' disabled={loading}><IoSearch style={{fontSize: '14px'}}/></Button>
                        </Popover>
                        <Form form={frmBuscar} layout='horizontal' >
                            <Input.Group compact>
                                <Form.Item name='txtAnioRegistro'  noStyle  >
                                    <Input size='small' style={{width:'30%'}} disabled={loading} />
                                </Form.Item>
                                <Form.Item name='txtRegistro' noStyle>
                                <Search size='small' style={{width:'70%'}} placeholder="Registro" enterButton="Buscar" onSearch={handleClickBuscar} disabled={loading } />
                                </Form.Item>
                            </Input.Group>
                        </Form>
                    </Space>
                </Col>
            </Row>
            
            <Table dataSource={lista} 
                   size="small" 
                   pagination={ paginacionManual ? {current: paginaActual,total: totalRows, showSizeChanger: false, pageSize: 20, size:'default'} : {pagination: true}} 
                   loading={loading} 
                   rowKey="id" 
                   onChange={handleTableChange} 
                   footer={() => <span style={{fontWeight: 'bold' }}>Nro. de registros {totalRows}</span>}
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
                // sorter={(a, b) => moment(a.fechaSumilla).unix() - moment(b.fechaSumilla).unix()}
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