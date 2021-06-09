import React, {useState, useEffect, Fragment}  from "react";
import {  useParams, Link, Route } from "react-router-dom";
import { Row, Col, Card, Table, Tag, Button, notification, Avatar, Popover, Badge, Space, Descriptions, Divider } from 'antd';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignInAlt, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import TextArea from "antd/lib/input/TextArea";
import moment from 'moment';

const Oficio = () => {
    console.log("Inicio");
    const [oficio, setOficio] = useState({})
    const [loading, setLoading] = useState(true);
    const servidorAPI = process.env.REACT_APP_API_URL;
    const params = useParams();

    const { Column } = Table;

    useEffect( () => {
        obtenerOficio();
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
            
        } catch (error) {
            notification['error']({
                message: 'Error',
                description: `Error al cargar los oficios ${error}`
              });    
        }
    }

    return (
        <Card title="Oficio">
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
                        <Descriptions.Item label="Asunto"><TextArea style={{backgroundColor:"white", border:"0px", color:"black"}} disabled rows="3" value={oficio?.asunto}></TextArea> </Descriptions.Item>
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
                <Divider orientation="left">Lista de sumillas</Divider>                
                <Col span={20}>


                    <Table dataSource={oficio.sumillas} size="small" pagination={false} loading={loading} rowKey="id" > 
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
                                    {rowData.sumiUsuarioDestino}
                                </div>
                            )}}
                        />
    
                        <Column title="Sumilla"  
                            render={
                                rowData => {return(
                                    <div>
                                        <span style={{whiteSpace:"nowrap"}}> 
                                            <div> 
                                                    {`${rowData.sumilla} `}
                                            </div>
                                        </span>
                                    </div>
                                )}
                            }
                        />
                </Table>                            
                </Col>
            </Row>
        </Card>
    )
}

export default Oficio
