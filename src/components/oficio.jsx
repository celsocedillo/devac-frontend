import React, {useState, useEffect, Fragment}  from "react";
import {  useParams, Link, Route } from "react-router-dom";
import { Row, Col, Card, Table, Tag, Button, notification, Avatar, Popover, Badge, Space, Descriptions } from 'antd';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import TextArea from "antd/lib/input/TextArea";

const Oficio = () => {
    console.log("Inicio");
    const [oficio, setOficio] = useState({})
    const [loading, setLoading] = useState(true);
    const servidorAPI = process.env.REACT_APP_API_URL;
    const params = useParams();


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
                        <Descriptions.Item label="Registro" span={3}>{`${oficio[0]?.anio} - ${oficio[0]?.registroDpto}`} </Descriptions.Item>
                        <Descriptions.Item label="Oficio" span={3}>{`${oficio[0]?.tipoOficio} - ${oficio[0]?.anio} - ${oficio[0]?.digitos}`} </Descriptions.Item>
                        <Descriptions.Item label="Remitente" span={3}>
                        <div>
                                {oficio[0]?.tipoDocumento === "I" ? <div><FontAwesomeIcon style={{color:"#faad14"}}  icon={faUser}/> {` ${oficio[0]?.usuarioOrigen}`}</div>
                                : <div><FontAwesomeIcon style={{color:"purple"}} icon={faSignInAlt}/> {` ${oficio[0]?.usuarioOrigen} - ${oficio[0]?.dptoOrigen}`}</div>
                                }
                        </div>
                        </Descriptions.Item>
                        <Descriptions.Item label="Destinatario" span={3}>{oficio[0]?.usuarioDestino} </Descriptions.Item>
                        <Descriptions.Item label="Asunto"><TextArea style={{backgroundColor:"white", border:"0px", color:"black"}} disabled rows="5" value={oficio[0]?.asunto}></TextArea> </Descriptions.Item>
                    </Descriptions>
                </Col>
                <Col span={8}>
                <Descriptions bordered size="small">
                        <Descriptions.Item label="Ingresado :" span={3}>{`${oficio[0]?.usuario}`} </Descriptions.Item>
                        <Descriptions.Item label="Fecha ingreso:" span={3}>{`${oficio[0]?.fechaIngreso}`} </Descriptions.Item>
                    </Descriptions>
                </Col>
            </Row>
        </Card>
    )
}

export default Oficio
