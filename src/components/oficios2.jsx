import React, {useState, useEffect}  from "react";
import { Link } from "react-router-dom";
import moment from 'moment';
import NumberFormat from "react-number-format";

import ModalOficio from './modalOficio';
import { Row, Col, Card, Table, Tag, Button, notification, Avatar, Popover, Badge, Space } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShareSquare, faSearchPlus, faEllipsisH, faUser, faCity, faSignInAlt, faReply } from '@fortawesome/free-solid-svg-icons';

require('dotenv').config();

function Oficios2(){

    const servidorAPI = process.env.REACT_APP_API_URL;

    const { Column } = Table;

    const [lista, setLista] = useState(null);
    const [loading, setLoading] = useState(true);
    const [divFiltro, setDivFiltro] = useState(null);
    const [demorados, setDemorados] = useState(0);
    const [enEspera, setEnEspera] = useState();
    const [showModalOficio, setShowModalOficio] = useState(false);

    useEffect(() => {
        async function obtenerData()  {
            setLoading(true);
            try {           
                const response = await fetch(`${servidorAPI}ultimoOficios`);
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
                    description: `Error al cargar los oficios ${error}`
                  });    
            }
       }

       obtenerData();
    }, []);

    const closeModalOficio =  async (show) => {
        setShowModalOficio(show);
    }
    
    return(
        <Card title="Lista de oficios">
            <Table dataSource={lista} size="small" pagination={false} loading={loading} rowKey="id" > 
            <Column title="Año" dataIndex="anio" key="anio" />
            <Column title="Registro" dataIndex="registroDpto" key="registroDpto"  />
            <Column title="Fecha" key="fechaIngreso" 
                sorter={(a, b) => moment(a.fechaIngreso).unix() - moment(b.fechaIngreso).unix()}
                render={rowData => (moment(rowData.fechaIngreso).format("DD/MM/YYYY"))}/>
            <Column title="Remitente" key="usuarioOrigen" width={220}
                    render={rowData => {
                        return(
                            <div>
                                {rowData.tipoDocumento === "I" ? <div><FontAwesomeIcon style={{color:"#faad14"}}  icon={faUser}/> {` ${rowData.usuarioOrigen}`}</div>
                                : <div><FontAwesomeIcon style={{color:"purple"}} icon={faSignInAlt}/> {` ${rowData.usuarioOrigen} - ${rowData.dptoOrigen}`}</div>
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
                                                <FontAwesomeIcon style={{width:"15px", height:"15px"}} icon={faShareSquare} />
                                                </Badge>
                                         
                        }
                    </div>
                )}}
            />
            <Column title="Resp" 
                render={rowData => {return(
                    <div>
                        {rowData.contestacion > 0 && 
                                                <FontAwesomeIcon style={{width:"15px", height:"15px", color:"#096dd9"}} icon={faReply} />
                                         
                        }
                    </div>
                )}}
            />
            <Column title="" width={35} align="center" 
                     render={ rowData => 
                       <Link to={
                                {
                                pathname: `/oficio/${rowData.id}`
                                }}
                       ><FontAwesomeIcon icon={faSearchPlus}></FontAwesomeIcon>
                       </Link> 
                     }>
            </Column>

            {/* <Column title="FechaSumilla" key="fechaSumilla" width={30} 
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
            /> */}

            {/* <Column title="Sumillado" 
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
            /> */}
            {/* <Column title="Espera" width={30} 
            sorter={(a, b) => a.diasEspera - b.diasEspera}
            render={rowData => {
                return(
                    rowData.diasEspera >= 7 ?
                    <Badge count={rowData.diasEspera} style={{backgroundColor:"red"}} overflowCount="999"></Badge>
                    :
                    <Badge count={rowData.diasEspera} style={{backgroundColor:"green"}}></Badge>
                )
            }}
            />                    
 */}
       </Table>                 


            {/* <ModalOficio show={showModalOficio} onClose={closeModalOficio}></ModalOficio> */}
        </Card>
     );

};

export default Oficios2;