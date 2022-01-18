import React  from "react";
import { Link } from "react-router-dom";
import moment from 'moment';
import NumberFormat from "react-number-format";

import ModalOficio from './modalOficio';
import { Row, Col, Card, Table, Tag, Button, notification, Avatar, Popover, Badge, Space } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusSquare, faSearchPlus, faEllipsisH } from '@fortawesome/free-solid-svg-icons';

require('dotenv').config();

const { Column } = Table;

class Oficios extends React.Component {

    //servidorAPI = 'http://localhost:5200/api/';
    //servidorAPI = 'http://192.198.10.241:5200/api/';
    servidorAPI = process.env.REACT_APP_API_URL;
    

    constructor(props) {
        super(props);
        this.state = {
            lista: [],
            loading: true,
            divFiltro: false,
            demorados: 0,
            showModalOficio: false
         }
    }

     async componentDidMount() {
        await this.obtenerData();
        this.setState({demorados: this.state.lista.filter(a => a.diasEspera > 6).length})
        //let contador = this.state.lista.filter(a => a.diasEspera > 6);
        //console.log("contador", contador.length);
    }

    async obtenerData() {
        this.setState({loading: true})
        try {           
            const response = await fetch(`${this.servidorAPI}oficios/2020`);
            const data = (await response.json());
            if (response.status === 201){
                this.setState({ lista: data.data});
            }else{
                throw new Error (`[${data.error}]`)                    
            }            
            this.setState({ loading: false});
        } catch (error) {
            notification['error']({
                message: 'Error',
                description: `Error al cargar los contratos ${error}`
              });    
        }

    }


    onFinish(values){
        //console.log("valores", values.sltEstado);
    }

    closeModalOficio =  async (show) => {
        this.setState({showModalOficio: show});
    }

    render(){
        const { lista, loading } = this.state;
        return(
           <Card title="Lista de oficios">


                    <Row style={{backgroundColor:"#ececec"}}>
                        <Col span={2} style={{textAlign:"center"}}>
                            <Card>
                                <div>
                                <Badge count={this.state.lista.length} style={{backgroundColor: "#40a9ff"}}>
                                </Badge>
                                </div>
                                Sumillas
                            </Card>
                        </Col>
                        <Col span={2} style={{textAlign:"center"}}>
                            <Card>
                                <div>
                                <Badge count={this.state.demorados}>
                                </Badge>
                                </div>
                                Demorados
                            </Card>
                        </Col>
                        <Col span={2} style={{textAlign:"center"}} >
                            <Card>
                            <div>
                                <Badge count={this.state.lista.length - this.state.demorados} style={{backgroundColor: "green"}}>
                                </Badge>
                                </div>
                                En espera
                            </Card>
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
                            rowData.diasEspera >= 7 ?
                            <Badge count={rowData.diasEspera} style={{backgroundColor:"red"}} overflowCount="999"></Badge>
                            :
                            <Badge count={rowData.diasEspera} style={{backgroundColor:"green"}}></Badge>
                        )
                    }}
                    />                    
                    <Column 
                        render={rowData => {
                                return(<Button type="text" size="small" icon={<FontAwesomeIcon icon={faSearchPlus}></FontAwesomeIcon>} onClick={() => this.setState({showModalOficio: true})}></Button>
                                )
                    }}>
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
               <ModalOficio show={this.state.showModalOficio} onClose={this.closeModalOficio}></ModalOficio>
           </Card>

           
        );
    }

}

export default Oficios;