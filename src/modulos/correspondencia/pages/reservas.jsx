import React, {useState, useEffect,  useContext}  from "react";
import { Link, location, useLocation } from "react-router-dom";
import moment from 'moment';
import { Row, Col, Card, Table, Button, notification, Tag, Popover, Input, Form, DatePicker,  Select } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faEllipsisH  } from '@fortawesome/free-solid-svg-icons';
import {  IoSearch} from 'react-icons/io5'
import UserContext from "../../../contexts/userContext";
//Factorizar despues
import {getTipoOficios, getReservas} from '../services/correspondenciaService'


require('dotenv').config();

function ReservasOficio(){

    //const servidorAPI = process.env.REACT_APP_API_URL;
    //const servidorAPI = `${process.env.REACT_APP_API_URL}reserva/`;

    const { Column } = Table;


    const [lista, setLista] = useState(null);
    const [loading, setLoading] = useState(false);
    const [listaOficios, setListaOficios] = useState([]);
    const [showMensaje, setShowMensaje] = useState(false);
    const [filtro, setFiltro] = useState(null);


    const [paginacionManual] = useState(true);
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalRows, setTotalRows] = useState(0);    

    const [frmBuscar]  = Form.useForm();
    const [frmFiltro]  = Form.useForm();
    const [ setFiltroOptions] = useState([]);
    const [ setFiltroValues] = useState([]);
    const {usuario, apiHeader} = useContext(UserContext);
    const location =useLocation();

    frmBuscar.setFieldsValue({'txtBusAnio': moment().year()})

    useEffect(() => {
        let pagina = 1;

        async function obtenerData(filtro, pagina)  {
            setLoading(true);
            const tipos = await getTipoOficios(usuario.direccionId)
            setListaOficios(tipos);
            const reservas = await getReservas(usuario.direccionId, filtro, pagina, apiHeader )
            setLista(reservas.data);
            setTotalRows(reservas.totalRows);
            setLoading(false);
            //await obterTipoOficios()
            //await obtenerReservas(usuario.direccionId,null, 1);
        }
        location?.pagina && (pagina = location?.pagina);
        setPaginaActual(pagina);

        if (location?.filtro)  {
            //setLista(JSON.parse(window.localStorage.getItem('filtrado')));
            obtenerData(location?.filtro, pagina)
            //obtenerOficios(0,0,location?.filtro,pagina);
            //setShowMensaje(true);
            setFiltro(location?.filtro);
        } else{
            if (usuario){
                console.log('tienen q ir a pagina', pagina);
                 obtenerData(null, pagina);
             }
        }

       
        }, [usuario]);


    // const obterTipoOficios = async() => {
    //     const tipos = await getTipoOficios(usuario.direccionId, apiHeader);
    //     setListaOficios(tipos);
    //     // const response = await fetch(`${servidorAPI}tipoOficio/ByDireccion/${usuario.direccionId}`, {method: 'GET', headers: apiHeader});
    //     // const data = await response.json();
    //     // if (response.status === 200){
    //     //     setListaOficios(data);
    //     // }else{
    //     //     throw new Error (`[${data.error}]`)                    
    //     // }            
    // }

    // const obtenerReservas = async(pdireccionId, filtro, ppagina) => {
    //     try {
    //         setLoading(true);
    //         //const params = `pagina=${ppagina}`;
    //         filtro = `pagina=${ppagina}&${filtro}` 

    //         const response = await fetch(`${servidorAPI}${pdireccionId}/?${filtro}`, {method: 'GET', headers: apiHeader});
    //         const data = (await response.json());
    //         if (response.status === 200){
    //             setLista(data.data);
    //             setTotalRows(data.totalRows);
    //         }else{
    //             throw new Error (`[${data.error}]`)                    
    //         }            
    //         setLoading(false);
    //     } catch (error) {
    //         setLoading(false);
    //         notification['error']({
    //             message: 'Error',
    //             description: `Error al cargar los oficios ${error}`
    //           });                       
    //     }

    // }

    const handleTableChange = async (pagination, filters, sorter) => {
        //console.log('Various parameters', pagination, filters, sorter);
        if (paginacionManual) {
            setLoading(true);
            setPaginaActual(pagination.current);
            //await obtenerReservas(usuario.direccionId, filtro, pagination.current);
            const reservas = await getReservas(usuario.direccionId, filtro, pagination.current, apiHeader)
            setLista(reservas.data);
            setTotalRows(reservas.totalRows);
            setLoading(false);
            //obtenerOficios(0,0,filtro,pagination.current);
        }
    };


    const handleClickFiltrar = async() => {
        try {
            
            let xfiltro = '';
            let xfiltroOptions=[];
            let xfiltroValues=[];
            console.log('tipo',frmFiltro.getFieldValue('sltTipoOficio'))
            const tipoOficioId = frmFiltro.getFieldValue('sltTipoOficio');
            const fechaInicio = frmFiltro.getFieldValue('txtFecha')?.inicio
            const fechaFin = frmFiltro.getFieldValue('txtFecha')?.fin
            const destinatario = frmFiltro.getFieldValue('txtDestinatario')
            const asunto = frmFiltro.getFieldValue('txtAsunto')
            const estado = frmFiltro.getFieldValue('sltEstado');

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
            if (tipoOficioId){
                xfiltro = `${xfiltro}&tipoOficioId=${encodeURI(tipoOficioId)}`  
                xfiltroOptions.push({label:`tipoOficioId=${tipoOficioId}`, value:'4'})
                xfiltroValues.push('3')
            }
            if (destinatario){
                xfiltro = `${xfiltro}&destinatario=${encodeURI(destinatario)}`  
                xfiltroOptions.push({label:`destinatario=${destinatario}`, value:'4'})
                xfiltroValues.push('4')
            }
            if (asunto){
                xfiltro = `${xfiltro}&asunto=${encodeURI(asunto)}`  
                xfiltroOptions.push({label:`asunto=${asunto}`, value:'3'})
                xfiltroValues.push('5')
            } 
            if (estado){
                xfiltro = `${xfiltro}&estado=${encodeURI(estado)}`  
                xfiltroOptions.push({label:`estado=${estado}`, value:'3'})
                xfiltroValues.push('6')
            } 
            if (xfiltro.length > 0){
                setLoading(true);
                setPaginaActual(1);
                setFiltro(xfiltro);
                //await obtenerReservas(usuario.direccionId,xfiltro,1);
                const reservas = await getReservas(usuario.direccionId,xfiltro,1, apiHeader)
                setLista(reservas.data);
                setTotalRows(reservas.totalRows);
                setLoading(false);
            }


            // if (excel){
            //     const response = await fetch(`${servidorAPI}oficiosSumillaByFiltroExcel/${usuario.departamentoId}/1/?${xfiltro}`, {method: 'GET', headers: apiHeader});        
            //     response.blob().then(blob => {
            //         var url = window.URL.createObjectURL(blob);
            //         var a = document.createElement('a');
            //         a.href = url;
            //         a.download = "filename.xlsx";
            //         document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            //         a.click();    
            //         a.remove();  //afterwards we remove the element again                           
            //     });

            // }else{
            //     setFiltroOptions(xfiltroOptions);
            //     setFiltroValues(xfiltroValues);
            //     setLista([]);
            //     setTotalRows(0);
   
            //     if (xfiltro.length > 0){
            //         const data = await buscarSumillas(null,0,0,usuario.departamentoId,xfiltro,1);
            //         if (data.data?.length > 0 ) {
            //             setPaginaActual(1);
            //             setFiltro(xfiltro);
            //             setLista(data.data);
            //             setTotalRows(data.totalRows);
            //         }
            //     }
            // }

        } catch (error) {
            notification['error']({
                message: 'Error',
                description: `Error al validar los filtros ${error}`
              });                       
        }

    }
    const handleClickReset = async () =>{
        setFiltro(null);
        //setFiltroValues([])
        //setFiltroOptions([]);
        //setShowMensaje(!showMensaje);
        frmFiltro.setFieldsValue({'txtFecha': null})
        frmFiltro.setFieldsValue({'txtFecha': null})
        frmFiltro.setFieldsValue({'txtAsunto': null})
        frmFiltro.setFieldsValue({'txtDestinatario': null})
        frmFiltro.setFieldsValue({'sltEstado': null})
        frmFiltro.setFieldsValue({'sltTipoOficio': null})
        //await obtenerReservas(usuario.direccionId,null, 1);
        setLoading(true);
        const reservas = await getReservas(usuario.direccionId,null, 1, apiHeader)
        setLista(reservas.data);
        setTotalRows(reservas.totalRows);
        setLoading(false);
    }

    
    return(
        <Card title="Lista de reservas de oficios" size="small">
            <Row>
                <Col span="18">
                    <Link to="/correspondencia/reserva">
                    <Button size="small">Nuevo</Button>
                    </Link>
                    
                </Col> 
                <Col span="6" style={{marginBottom: '2px', display: 'flex', justifyContent: 'end'}}>
                    <Popover title="Fitro de busqueda" trigger="click" 
                        content={
                        <Form form={frmFiltro} layout="vertical">
                            <Form.Item label="Fecha" >
                                <Input.Group compact>
                                    <Form.Item name={['txtFecha', 'inicio']} noStyle >
                                        <DatePicker placeholder="Fecha inicio" style={{width:'50%'}} size="small"/>
                                    </Form.Item>
                                    <Form.Item name={['txtFecha', 'fin']} noStyle>
                                        <DatePicker placeholder="Fecha fin" style={{width:'50%'}} size="small"/>
                                    </Form.Item>
                                </Input.Group>
                            </Form.Item>
                            <Form.Item label="Oficios" name="sltTipoOficio" labelCol={{span: 6}} >
                                <Select>
                                    {listaOficios.map(item => <Select.Option key={item.id} value={item.id}>{item.descripcion}</Select.Option>)}
                                </Select>
                            </Form.Item>
                            <Form.Item name="txtDestinatario" label="Destinatario :" >
                                        <Input size="small"></Input>
                            </Form.Item>
                            <Form.Item name="txtAsunto" label="Asunto :" labelCol={{span: 6}}>
                                        <Input size="small"></Input>
                            </Form.Item>
                            <Form.Item label="Estado" name="sltEstado" labelCol={{span: 6}} >
                                <Select>
                                    <Select.Option key='P' value='P'>Ingresado</Select.Option>)
                                    <Select.Option key='R' value='R'>Remitido</Select.Option>)
                                    <Select.Option key='A' value='A'>Anulado</Select.Option>)
                                </Select>
                            </Form.Item>
                            <Button size='small' onClick={handleClickFiltrar}>Filtrar</Button>
                            <Button size='small' onClick={handleClickReset}>Reset</Button>
                        </Form>}
                    >
                        <Button size='small' disabled={loading}><IoSearch style={{fontSize: '14px'}}/></Button>
                    </Popover>
                </Col>
            </Row>
            <Table 
                dataSource={lista} 
                size="small" 
                loading={loading} 
                rowKey="id" 
                pagination={ paginacionManual ? {current: paginaActual, total: totalRows, showSizeChanger: false, pageSize: 20} : {pagination: true}} 
                onChange={handleTableChange}
                footer={() => <span style={{fontWeight: 'bold' }}>Nro. de registros {totalRows}</span>}
            > 
            <Column title="TipoOficio"  
                render={rowData => `${rowData.tipoOficio.descripcion}`}
            />
            <Column title="NúmeroOficio"  
                render={rowData => 
                    <Link to={{pathname : `/correspondencia/reserva/${rowData.tipoOficioId}/${rowData.anio}/${rowData.numeroOficio}`,
                               filtro: filtro,
                               pagina: paginaActual}} >
                    {`${rowData.anio}-${rowData.numeroOficio}`}                     
                    </Link>
                }      
            />
            <Column title="Fecha" key="fechaIngreso" 
                sorter={(a, b) => moment(a.fechaIngreso).unix() - moment(b.fechaIngreso).unix()}
                render={rowData => (moment(rowData.fechaIngreso).format("DD/MM/YYYY"))}/>
            <Column title="Destinatario" dataIndex="referenciaDestinatario" key="usuario" 
            />                

            <Column title="Solicitante" dataIndex="usuario" key="usuario" 
            />                
            <Column title="Asunto"  
                render={rowData => { return(
                <div>
                    <span style={{whiteSpace:"nowrap"}}> 
                        {rowData?.asunto?.length>50 ? 
                        <div> 
                                {`${rowData?.asunto?.substring(0,49)} `}
                                <Popover
                                    content={rowData?.asunto}
                                >
                                    <FontAwesomeIcon style={{border:"solid 1px #d8d8d8", backgroundColor:"#feffb0", paddingTop:"1px", height:"8px"}} icon={faEllipsisH}></FontAwesomeIcon>
                                </Popover>
                        </div>
                        :rowData.asunto}                            
                    </span>
                    <div style={{fontSize:"11px"}}>
                        <span style={{color:"#5a9e5a"}}>
                            {rowData.departamentoOrigen}
                        </span>
                    </div>
                </div>
            )}}
            />
            <Column title='Estado' 
                render={rowData => {return(
                    rowData?.estado ==='P' ? <Tag size='small' color='blue'>Ingresado</Tag>
                    : rowData?.estado ==='R' ? <Tag size='small' color='green'>Remitido</Tag>
                    : rowData?.estado ==='A' && <Tag size='small' color='red'>Anulado</Tag>
                )}}
            >
            </Column>
            </Table>                 
        </Card>
     );

};

export default ReservasOficio;