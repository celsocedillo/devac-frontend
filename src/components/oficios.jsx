import React, {useState, useEffect, useRef}  from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import moment from 'moment';
import { Row, Col, Card, Table, Button, notification, Avatar, Popover, Badge, Input, Form, DatePicker, Alert } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faEllipsisH  } from '@fortawesome/free-solid-svg-icons';
import { IoPersonOutline, IoMailOutline, IoArrowRedoOutline, IoArrowUndoOutline, IoFlashOutline, IoCalendarClearOutline, IoCaretForwardCircleOutline} from 'react-icons/io5'


require('dotenv').config();

function Oficios2(){

    const location = useLocation();
    const servidorAPI = process.env.REACT_APP_API_URL;

    const { Column } = Table;
    let history = useHistory();

    const [lista, setLista] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showBuscar, setShowBuscar] = useState(false);
    const [showFiltro, setShowFiltro] = useState(false);
    const [showMensaje, setShowMensaje] = useState(false);
    const [filtro, setFiltro] = useState(null);
    const [mensaje, setMensaje] = useState('');

    const [frmBuscar]  = Form.useForm();
    const [frmFiltro]  = Form.useForm();
    const refBusAnio = useRef(null);

    useEffect(() => {
        frmBuscar.setFieldsValue({'txtBusAnio': moment().year()})
        async function obtenerData()  {
            setLoading(true);
            try {           
                let filtro=`fechaDesde=${moment().subtract(45, 'days')}&fechaHasta=${moment()}`
                const response = await fetch(`${servidorAPI}oficiosByFiltro/0/0/?${filtro}`);
                const data = (await response.json());
                if (response.status === 201){
                    setLista(data.data);
                }else{
                    throw new Error (`[${data.error}]`)                    
                }            
                setLoading(false);
        
            } catch (error) {
                notification['error']({
                    message: 'Error',
                    description: `Error al cargar los oficios ${error}`
                  });    
            }
       }
       if (location.filtro)  {
           setLista(JSON.parse(window.localStorage.getItem('filtrado')));
           setMensaje(window.localStorage.getItem('msgFiltro'));
           setShowMensaje(true);
           setLoading(false);
           setFiltro(window.localStorage.getItem('filtro'));
       } 
       else {
           obtenerData();
           setLoading(false);
       }
    }, []);

    const openBusqueda = () => {
        setShowBuscar(true);        
        setTimeout(() => {refBusAnio.current.focus();}, 100)
    }

    const clickBuscar = async () =>{
        if (frmBuscar.getFieldValue('txtBusRegistro').length > 0){
            try {           
                const response = await fetch(`${servidorAPI}oficiosByFiltro/${frmBuscar.getFieldValue('txtBusAnio')}/${frmBuscar.getFieldValue('txtBusRegistro')}`);
                const data = (await response.json());
                if (response.status === 201){
                    console.log('datos', data.data);
                    data.data.length === 1 && history.push(`/oficio/${data.data[0].id}`);
                }else{
                    throw new Error (`[${data.error}]`)                    
                }            
                setLoading(false);
            } catch (error) {
                notification['error']({
                    message: 'Error',
                    description: `Error al cargar los oficios ${error}`
                  });    
            }
        }
    }

    const filtrar = async () => {
        try {
            if (frmFiltro.getFieldValue('txtFecha') || 
                frmFiltro.getFieldValue('txtRemitente') || 
                frmFiltro.getFieldValue('txtAsunto') ||
                frmFiltro.getFieldValue('txtOficio')) {
                
                let filtro = '';
                frmFiltro.getFieldValue('txtFecha')?.inicio && (filtro = `${filtro}fechaDesde=${frmFiltro.getFieldValue('txtFecha')?.inicio}`)
                frmFiltro.getFieldValue('txtFecha')?.fin && (filtro = `${filtro}&fechaHasta=${frmFiltro.getFieldValue('txtFecha')?.fin}`)                 
                frmFiltro.getFieldValue('txtRemitente') && (filtro = `${filtro}&remitente=${frmFiltro.getFieldValue('txtRemitente')}`)                 
                frmFiltro.getFieldValue('txtAsunto') && (filtro = `${filtro}&asunto=${frmFiltro.getFieldValue('txtAsunto')}`)                 
                frmFiltro.getFieldValue('txtOficio') && (filtro = `${filtro}&oficio=${frmFiltro.getFieldValue('txtOficio')}`)                 
                console.log("filtro", filtro);
                setLoading(true);
                const response = await fetch(`${servidorAPI}oficiosByFiltro/0/0/?${filtro}`);
                const data = (await response.json());
                if (response.status === 201){
                    console.log('datos', data.data);
                    window.localStorage.setItem("filtrado", JSON.stringify(data.data));
                    let msg='';
                    setFiltro(filtro);
                    setLista(data.data);
                    setLoading(false);
                    setShowFiltro(!showFiltro);
                    frmFiltro.getFieldValue('txtFecha')?.inicio && (msg=`[${moment(frmFiltro.getFieldValue('txtFecha')?.inicio).format('DD-MM-YYYY')}]`)
                    frmFiltro.getFieldValue('txtFecha')?.fin && (msg=` ${msg} [${moment(frmFiltro.getFieldValue('txtFecha')?.fin).format('DD-MM-YYYY')}]`)
                    frmFiltro.getFieldValue('txtRemitente') && (msg=`${msg} [${frmFiltro.getFieldValue('txtRemitente')}]`)
                    frmFiltro.getFieldValue('txtAsunto') && (msg=`${msg} [${frmFiltro.getFieldValue('txtAsunto')}]`)
                    frmFiltro.getFieldValue('txtOficio') && (msg=`${msg} [${frmFiltro.getFieldValue('txtOficio')}]`)
                    setMensaje(`${msg} Se encontraron ${data.data.length} registros`);
                    window.localStorage.setItem("msgFiltro", `${msg} Se encontraron ${data.data.length} registros`);
                    window.localStorage.setItem("filtro", filtro);                    
                    setShowMensaje(true);
                }else{
                    throw new Error (`[${data.error}]`)                    
                }            
                setLoading(false);
             
            }
        } catch (error) {
            notification['error']({
                message: 'Error',
                description: `Error al cargar los oficios ${error}`
              });           
        }
    }
    
    return(
        <Card title="Lista de oficios" size="small"
              extra={
                  <div style={{position: 'fixed',
                    right: '32px',
                    bottom: '50px',
                    display: 'flex',
                    flexDirection : 'column',
                    zIndex: 2147483640,
                    cursor: 'pointer'}}>

                  <Popover style={{position:'fixed', 
                           display:'flex'}} 
                           trigger='click' 
                           visible={showBuscar}
                           onVisibleChange={() => {setShowBuscar(!showBuscar); }}
                           forceRender
                           content={
                            <Form form={frmBuscar} layout="vertical" >
                                <h3>Busqueda de oficio</h3>
                                <Form.Item label='Anio' name='txtBusAnio'>
                                    <Input prefix={<IoCalendarClearOutline/>}></Input>
                                </Form.Item>
                                <Form.Item label='Registro' name='txtBusRegistro'>
                                    <Input prefix={<IoCaretForwardCircleOutline/>} ref={refBusAnio} onPressEnter={clickBuscar}></Input>
                                </Form.Item>
                                <Form.Item >
                                    <Button type='primary' size='small' onClick={clickBuscar}>OK</Button>
                                </Form.Item>
                            </Form>
                    }
                  >
                      <Avatar onClick={openBusqueda} style={{backgroundColor:'#85c3fd'}} icon={<IoFlashOutline style={{fontSize: '15px', color:'black'}}/>}>
                      </Avatar>
                  </Popover>
                  </div>
            }        
        >
            <Row>
            <Col span={24}>
            <Button size='small' style={{marginBottom:'4px'}} onClick={()=> setShowFiltro(!showFiltro)}>Filtro</Button>
            </Col>
            </Row>
            {showFiltro &&
            <Card>
                <Form form={frmFiltro}>
                    <Row>
                        <Col span={12}>
                            
                            <Form.Item name="txtRemitente" label="Remitente :" labelCol={{span: 4}}>
                                <Input></Input>
                            </Form.Item>
                            <Form.Item name="txtAsunto" label="Asunto :" labelCol={{span: 4}}>
                                <Input></Input>
                            </Form.Item>
                            <Form.Item labelCol={{span: 4}} >
                                <Button type="primary" size="small" onClick={filtrar}>Consultar</Button>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Fecha" labelCol={{span: 4}}>
                                <Input.Group compact>
                                    <Form.Item name={['txtFecha', 'inicio']} noStyle >
                                        <DatePicker placeholder="Fecha inicio" style={{width:'50%'}} size="small"/>
                                    </Form.Item>
                                    <Form.Item name={['txtFecha', 'fin']} noStyle>
                                        <DatePicker placeholder="Fecha fin" style={{width:'50%'}} size="small"/>
                                    </Form.Item>
                                </Input.Group>
                            </Form.Item>
                            <Form.Item name="txtOficio" label="Oficio :" labelCol={{span: 4}}>
                                <Input></Input>
                            </Form.Item>                   
                        </Col>
                    </Row>
                </Form>
            </Card>
            }
            {showMensaje && <Alert message={mensaje} type="success" visible={showMensaje} size="small"/>}
            <Table dataSource={lista} size="small" loading={loading} rowKey="id" pagination={{defaultPageSize:20}} > 
            <Column title="Año" dataIndex="anio" key="anio" />
            <Column title="Registro" key="registroDpto"
                render={rowData => 
                    <Link to={
                        {
                        pathname: `/oficio/${rowData.id}`,
                        filtro: filtro
                        }}
               >{rowData.registroDpto}
               </Link> 

                }
            />
            <Column title="Fecha" key="fechaIngreso" 
                sorter={(a, b) => moment(a.fechaIngreso).unix() - moment(b.fechaIngreso).unix()}
                render={rowData => (moment(rowData.fechaIngreso).format("DD/MM/YYYY"))}/>
            <Column title="Remitente" key="usuarioOrigen" width={220}
                    render={rowData => {
                        return(
                            <div>
                                {rowData.tipoDocumento === "I" ? <div><IoPersonOutline style={{color:"green"}}/>  {` ${rowData.usuarioOrigen}`}</div>
                                : <div><IoMailOutline style={{color:"purple"}}/> {` ${rowData.usuarioOrigen} - ${rowData.dptoOrigen}`}</div>
                                }
                            </div>
                        )
                    }}
            />                
            <Column title="Oficio"  
                render={rowData => (`${rowData.tipoOficio}-${rowData.anio}-${rowData.digitos}`)}/>
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
            <Column title="Sumillas" 
                render={rowData => {return(
                    <div>
                        {rowData.sumillas > 0 && <Badge offset={[3,10]} size="small" style={{backgroundColor:"green", fontSize: "11px"}} count={rowData.sumillas} >
                                                <IoArrowRedoOutline style={{fontSize:"18px"}}/>
                                                </Badge>
                                         
                        }
                    </div>
                )}}
            />
            <Column title="Resp" 
                render={rowData => {return(
                    <div>
                        {rowData.contestacion > 0 && 
                                                <IoArrowUndoOutline style={{fontSize:"18px", color:"#096dd9"}} />
                        }
                    </div>
                )}}
            />

       </Table>                 
        </Card>
     );

};

export default Oficios2;