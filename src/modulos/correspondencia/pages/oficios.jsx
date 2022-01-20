import React, {useState, useEffect, useRef, useContext}  from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import moment from 'moment';
import { Row, Col, Card, Table, Button, notification, Popover, Badge, Input, Form, DatePicker, Space, Select } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faEllipsisH  } from '@fortawesome/free-solid-svg-icons';
import { IoPersonOutline, IoMailOutline, IoArrowRedoOutline, IoArrowUndoOutline,  IoSearch} from 'react-icons/io5'
import UserContext from "../../../contexts/userContext";


require('dotenv').config();

function Oficios2(){

    const location = useLocation();
    //const servidorAPI = process.env.REACT_APP_API_URL;
    const servidorAPI = `${process.env.REACT_APP_API_URL}correspondencia/`;

    const { Column } = Table;
    const { Search } = Input;

    let history = useHistory();

    const [lista, setLista] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showFiltro, setShowFiltro] = useState(false);
    const [showMensaje, setShowMensaje] = useState(false);
    const [filtro, setFiltro] = useState(null);
    const [ setMensaje] = useState('');

    const [paginacionManual] = useState(true);
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalRows, setTotalRows] = useState(0);    

    const [frmBuscar]  = Form.useForm();
    const [frmFiltro]  = Form.useForm();
    const [filtroOptions, setFiltroOptions] = useState([]);
    const [filtroValues, setFiltroValues] = useState([]);
    const {usuario, apiHeader} = useContext(UserContext);

    frmBuscar.setFieldsValue({'txtBusAnio': moment().year()})

    useEffect(() => {
        let pagina = 1;

        async function obtenerData()  {
            await obtenerOficios(0,0,null,pagina);
        }

       location?.pagina && (pagina = location?.pagina);
       setPaginaActual(pagina)
       if (location?.filtro)  {
           //setLista(JSON.parse(window.localStorage.getItem('filtrado')));

           obtenerOficios(0,0,location?.filtro,pagina);
           setMensaje(window.localStorage.getItem('msgFiltro'));
           setShowMensaje(true);
           setFiltro(window.localStorage.getItem('filtro'));
       } 
       else {
           if (usuario){
               obtenerData();
           }
       }
    }, [usuario]);

    

    const clickBuscar = async () =>{
        if (frmBuscar.getFieldValue('txtBusRegistro')){
            try {           
                const response = await fetch(`${servidorAPI}oficiosByFiltro/${frmBuscar.getFieldValue('txtBusAnio')}/${frmBuscar.getFieldValue('txtBusRegistro')}/0`, {method: 'GET', headers: apiHeader});
                const data = (await response.json());
                if (response.status === 200){
                    //console.log('datos', data.data);
                    //data.data.data.length === 1 && history.push(`/corresponencia/oficio/${data.data.data[0].id}`, {method: 'GET', headers: apiHeader});
                    data.data.length === 1 && history.push({pathname: `/correspondencia/oficio/${data.data[0].id}`,
                                                                 search: `?filtro=${filtro}&pagina=${paginaActual}`})
                }else{
                    throw new Error (`[${data.error}]`)                    
                }            
                //setLoading(false);
            } catch (error) {
                notification['error']({
                    message: 'Error',
                    description: `Error al cargar los oficios ${error}`
                  });    
            }
        }
    }

    const filtrar = async () => {
        //Si hay valores en las cajas de texto
        if (frmFiltro.getFieldValue('txtFecha') || 
            frmFiltro.getFieldValue('txtRemitente') || 
            frmFiltro.getFieldValue('txtAsunto') ||
            frmFiltro.getFieldValue('txtOficio')
            ) {
            let filtro = '';
            frmFiltro.getFieldValue('txtFecha')?.inicio && (filtro = `${filtro}fechaDesde=${frmFiltro.getFieldValue('txtFecha')?.inicio}`)
            frmFiltro.getFieldValue('txtFecha')?.fin && (filtro = `${filtro}&fechaHasta=${frmFiltro.getFieldValue('txtFecha')?.fin}`)                 
            frmFiltro.getFieldValue('txtRemitente') && (filtro = `${filtro}&remitente=${frmFiltro.getFieldValue('txtRemitente')}`)                 
            frmFiltro.getFieldValue('txtAsunto') && (filtro = `${filtro}&asunto=${frmFiltro.getFieldValue('txtAsunto')}`)                 
            frmFiltro.getFieldValue('txtOficio') && (filtro = `${filtro}&oficio=${frmFiltro.getFieldValue('txtOficio')}`)                 
            //window.localStorage.setItem("filtrado", JSON.stringify(data.data.data));
            let msg='';
            //Buscar oficios por filtro
            setPaginaActual(1);
            obtenerOficios(0,0,filtro,1);
            setFiltro(filtro);
            setShowFiltro(!showFiltro);
            // frmFiltro.getFieldValue('txtFecha')?.inicio && (msg=`[${moment(frmFiltro.getFieldValue('txtFecha')?.inicio).format('DD-MM-YYYY')}]`)
            // frmFiltro.getFieldValue('txtFecha')?.fin && (msg=` ${msg} [${moment(frmFiltro.getFieldValue('txtFecha')?.fin).format('DD-MM-YYYY')}]`)
            // frmFiltro.getFieldValue('txtRemitente') && (msg=`${msg} [${frmFiltro.getFieldValue('txtRemitente')}]`)
            // frmFiltro.getFieldValue('txtAsunto') && (msg=`${msg} [${frmFiltro.getFieldValue('txtAsunto')}]`)
            // frmFiltro.getFieldValue('txtOficio') && (msg=`${msg} [${frmFiltro.getFieldValue('txtOficio')}]`)
            let xfiltro = '';
            let xfiltroOptions=[];
            let xfiltroValues=[];

            const fechaInicio = frmFiltro.getFieldValue('txtFecha')?.inicio
            const fechaFin = frmFiltro.getFieldValue('txtFecha')?.fin
            const remitente = frmFiltro.getFieldValue('txtRemitente');
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
            if (remitente){
                xfiltro = `${xfiltro}&remitente=${encodeURI(remitente)}`  
                xfiltroOptions.push({label:`remitente=${remitente}`, value:'3'})
                xfiltroValues.push('3')
            } 
            if (asunto){
                xfiltro = `${xfiltro}&asunto=${encodeURI(asunto)}`  
                xfiltroOptions.push({label:`asunto=${asunto}`, value:'4'})
                xfiltroValues.push('4')
            } 
            if (oficio){
                xfiltro = `${xfiltro}&oficio=${encodeURI(oficio)}`  
                xfiltroOptions.push({label:`oficio=${oficio}`, value:'5'})
                xfiltroValues.push('5')
            }

            setFiltroOptions(xfiltroOptions);
            setFiltroValues(xfiltroValues);

            setMensaje(`${msg} Se encontraron ${totalRows} registros`);
            window.localStorage.setItem("msgFiltro", `${msg} Se encontraron ${totalRows} registros`);
            window.localStorage.setItem("filtro", filtro);                    
            setShowMensaje(true);
        }
    } 

    const obtenerOficios = async(panio, pregistro, pfiltro, ppagina) => {
        try {
            setLoading(true);
            const response = await fetch(`${servidorAPI}oficiosByFiltro/${panio}/${pregistro}/${ppagina}/?${pfiltro}`, {method: 'GET', headers: apiHeader});
            const data = (await response.json());
            if (response.status === 200){
                setLista(data.data);
                setTotalRows(data.totalRows);
            }else{
                throw new Error (`[${data.error}]`)                    
            }            
            setLoading(false);
        } catch (error) {
            setLoading(false);
            notification['error']({
                message: 'Error',
                description: `Error al cargar los oficios ${error}`
              });                       
        }

    }

    const handleTableChange = (pagination, filters, sorter) => {
        //console.log('Various parameters', pagination, filters, sorter);
        if (paginacionManual) {
            setPaginaActual(pagination.current);
            obtenerOficios(0,0,filtro,pagination.current);
        }
    };

    const handleClickReset = async () =>{
        let pagina = 1;
        setFiltro(null);
        setFiltroValues([])
        setFiltroOptions([]);
        setShowMensaje(!showMensaje);
        frmFiltro.setFieldsValue({'txtFecha': null})
        frmFiltro.setFieldsValue({'txtFecha': null})
        frmFiltro.setFieldsValue({'txtAsunto': null})
        frmFiltro.setFieldsValue({'txtOficio': null})
        frmFiltro.setFieldsValue({'txtRemitente': null})
        await obtenerOficios(0,0,null,pagina);
    }


    
    return(
        <Card title="Lista de oficios" size="small">
            <Row >
                <Col span="18">
                </Col>
                <Col span="6" style={{marginBottom: '2px'}}>
                    <Space align="center">
                    <Popover title="Filtro de oficios" trigger="click" 
                        content={
                            <Form form={frmFiltro} layout="vertical">
                                    <Form.Item name="txtRemitente" label="Remitente :" >
                                        <Input></Input>
                                    </Form.Item>
                                    <Form.Item name="txtAsunto" label="Asunto :" >
                                        <Input></Input>
                                    </Form.Item>
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
                                    <Button size="small" onClick={filtrar}>Consultar</Button>           
                                    <Button size="small" onClick={handleClickReset}>Reset</Button>           

                        </Form>                            
                        }
                        >
                            <Button size='small' disabled={loading}><IoSearch style={{fontSize: '14px'}}/></Button>
                        </Popover>

                    <Form form={frmBuscar} layout="horizontal" >
                    <Input.Group compact>
                        <Form.Item name='txtBusAnio' noStyle>
                            <Input size='small' style={{width:'30%'}} ></Input>
                        </Form.Item>
                        <Form.Item name='txtBusRegistro' noStyle>
                            <Search size='small' style={{width:'70%'}} placeholder="Registro" enterButton="Buscar" onSearch={clickBuscar} disabled={loading} />
                            {/* <Input size='small' style={{width:'70%'}} prefix={<IoCaretForwardCircleOutline/>} ref={refBusAnio} onPressEnter={clickBuscar}></Input> */}
                        </Form.Item>
                    </Input.Group>
                    </Form>
                    </Space>
                </Col>
            </Row>

            {showMensaje && <Select suffixIcon={<IoPersonOutline/>} size='small' mode='multiple' options={filtroOptions} value={filtroValues}/>  }
   
            <Table 
                dataSource={lista} 
                size="small" 
                loading={loading} 
                rowKey="id" 
                pagination={ paginacionManual ? {current: paginaActual,total: totalRows, showSizeChanger: false, pageSize: 20} : {pagination: true}} 
                onChange={handleTableChange}
                footer={() => <span style={{fontWeight: 'bold' }}>Nro. de registros {totalRows}</span>}
            > 

            <Column title="Año" dataIndex="anio" key="anio" width={25} />
            <Column title="Registro" key="registroDpto" width={30}
                render={rowData => 
                    <Link to={
                        {
                        pathname: `/correspondencia/oficio/${rowData.id}`,
                        filtro: filtro,
                        pagina: paginaActual
                        }}
               >{rowData.registroDpto}
               </Link> 

                }
            />
            <Column title="Fecha" key="fechaIngreso" width={30}
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
            <Column title="Oficio" width={150}  
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