import React, {useState, useEffect, useRef, useContext}  from "react";
import {  Link, useLocation, useParams } from "react-router-dom";
import { useSelector, useDispatch} from 'react-redux'
import { Row, Col, Card, Table, Button, notification, Popover, Badge, Input, Form, DatePicker, Space, Select, Tag } from 'antd';
import { getActaCambioCustodio, createNewSolicitud } from '../actions/custodioAction'
import UserContext from "../../../contexts/userContext";
import { IoArrowBack } from 'react-icons/io5';
import SolicitudCambioCustodioLectura from "../components/SolicitudCambioCustodioLectura";
import SolicitudCambioCustodioEdit from "../components/SolicitudCambioCustodioEdit";

const SolicitudCambioCustodio = () =>{

    console.log('<<<< render >>>>>> SolicitudCambioCustodio');

    const params = useParams();
    const [pageReadOnly, setPageReadOnly] = useState(true);
    const [newRecord, setNewRecord] = useState(false);
    const { actaUsuario } = useSelector( state => state.custodio);
    const {usuario} = useContext(UserContext);
    const dispatch = useDispatch();
    console.log('acta', newRecord);


    useEffect(()=>{ 
        console.log('parametros', params.anio);
        if (params.anio && params.anio > 0) {
            setPageReadOnly(true);
            setNewRecord(false);
            dispatch(getActaCambioCustodio(params.anio, params.actaId));
        }else if (params.anio == 0){
            console.log('nuevo');
            dispatch(createNewSolicitud());
            setNewRecord(true);
            setPageReadOnly(false);
        }

    },[dispatch, usuario])

  
    return (
        <Card title='Solicitud de cambio de custodio' size="small"
        extra={<Link to={{pathname: `/activos/solicitudCambio`}}><Button icon={<IoArrowBack style={{marginTop:'2px'}} />} size="small" ><span>Regresar</span></Button></Link>}>
            {/* {(pageReadOnly && ((actaUsuario.estado === 'AP') || (actaUsuario.estado === 'AN')))
                ? <SolicitudCambioCustodioLectura></SolicitudCambioCustodioLectura>
                : actaUsuario.estado == "EA" 
                  ? <SolicitudCambioCustodioEdit newRecord={false}></SolicitudCambioCustodioEdit>   
                  : <SolicitudCambioCustodioEdit newRecord={true}></SolicitudCambioCustodioEdit>
            } */}
            {newRecord 
                ? <SolicitudCambioCustodioEdit newRecord={true}></SolicitudCambioCustodioEdit>
                : ((actaUsuario.estado === 'AP') || (actaUsuario.estado === 'AN')) 
                    ? <SolicitudCambioCustodioLectura></SolicitudCambioCustodioLectura>
                    : actaUsuario.estado == "EA" && <SolicitudCambioCustodioEdit newRecord={false}></SolicitudCambioCustodioEdit>   
            }
        </Card>
    )

}

export default SolicitudCambioCustodio