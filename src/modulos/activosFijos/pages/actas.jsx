import React  from "react";
import moment from 'moment';
import { Link } from "react-router-dom";

import Moment from 'react-moment';
import NumberFormat from "react-number-format";


import { Card, Table, Tag, Button,  Form,  Select, notification } from 'antd';
import { ZoomInOutlined, PlusOutlined } from '@ant-design/icons';

require('dotenv').config();

const { Column } = Table;

class Actas extends React.Component {

    //servidorAPI = 'http://localhost:5200/api/';
    //servidorAPI = 'http://192.198.10.241:5200/api/';
    servidorAPI = process.env.REACT_APP_API_URL;
    

    constructor(props) {
        super(props);
        this.state = {
            lista: [],
            loading: true,
            estadosSituacionUsuario: [],
            divFiltro: false,
            lstEstados: []
         }
    }

    async componentDidMount() {
        
        //const xest = await fetch(`${this.servidorAPI}OtrosServicios/EstadoSituacionByUsuario/${localStorage.getItem("usuario")}`);
        const xest = await fetch(`${this.servidorAPI}otros/EstadosUsuario/${localStorage.getItem("usuario")}`);
        const x =  await xest.json();
        const res = x.data;
        console.log("data", res);
        
        res.map(m => {
            this.setState({estadosSituacionUsuario: [...this.state.estadosSituacionUsuario, m.idEstadoOrigen]});
            //(m.estadoOrigenId === m.estadoDestinoId) && this.setState({lstEstados: [...this.state.lstEstados, <Option value={m.estadoOrigenId}>Estado</Option>]})
            (m.idEstadoOrigen === m.idEstadoDestino) && this.setState({lstEstados: [...this.state.lstEstados, {id: m.idEstadoOrigen, label: m.estadoOrigen.descripcion}]})
        })
        console.log('estados', this.state.estadosSituacionUsuario);

        this.setState({loading: true})
        //const data = await fetch(`${this.servidorAPI}Acta/ByEstadoSituacion?estados=[${this.state.estadosSituacionUsuario}]`);
        const data = await fetch(`${this.servidorAPI}actas/ByEstadoSituacion?estados=${this.state.estadosSituacionUsuario}`);
        const lis = (await data.json()).data;
        this.setState({ lista: lis, loading: false});
        //console.log(this.state.lista);
    }

    filtrar(){
        //console.log("filtrar");
    }

    onFinish(values){
        //console.log("valores", values.sltEstado);
    }

    render(){
        const { lista, loading } = this.state;
        return(
           <Card title="Lista de actas">
               <Link to="/acta"><PlusOutlined/> Nuevo</Link>
               {/* <Button size="small" className="btn-nolines"><PlusOutlined></PlusOutlined> Nuevo</Button> */}
               {/* <Button size="small" className="btn-nolines" onClick={() => this.setState({divFiltro: !this.state.divFiltro})}><FilterOutlined></FilterOutlined> Filtro</Button> */}
               {
                   this.state.divFiltro &&
                   <Form 
                   labelCol={{ span: 4 }}
                   wrapperCol={{ span: 8 }}
                   name="advanced_search"
                   layout="horizontal"
                   onFinish={this.onFinish}
                   style={{background:"#607d8b14", border: "1px solid lightgray", padding: "2px 2px"}}
                   >
                           <Form.Item
                               name="sltEstadoSituacion"
                               label="Estado Situación :"
                           >
                               <Select >
                                {this.state.lstEstados.map(item => (
                                    <Select.Option key={item.id} value={item.id}>
                                        {item.label}
                                    </Select.Option>
                                ))}
                               </Select>
                           </Form.Item>
                           <Form.Item
                               name="sltEstado"
                               label="Estado :"
                           >
                               <Select >
                                    <Select.Option value="I">
                                        "Ingresado"
                                    </Select.Option>
                                    <Select.Option value="A">
                                        "Aprobado"
                                    </Select.Option>
                               </Select>
                           </Form.Item>                        
                           <Form.Item wrapperCol={{ offset: 10, span: 8 }}>
                                <Button type="primary" htmlType="submit" >Filtrar</Button>
                           </Form.Item>
                  </Form>
               }

               <Table dataSource={lista} size="small" pagination={false} loading={loading} rowKey="actaId" > 
                    <Column title="Id" dataIndex="actaId" key="actaId" width={1} />
                    <Column title="Fecha" key="fechaActa" width={5} key="fechaActa"
                        sorter={(a, b) => moment(a.fechaActa).unix() - moment(b.fechaActa).unix()}
                        render={rowData => (<Moment format="DD/MM/YYYY" date={rowData.fechaActa}></Moment>)}/>
                    <Column title="Acta" width={180} key="numeroActa"  key="id"
                        render={ rowData => (
                          <div style={{ ellipsis: true }}>
                            {rowData.numeroActa}
                          </div>
                      
                        )
                        }
                    />

                    <Column title="Datos" key="comentarios" 
                        render={rowData => (
                        <div>
                            <div>{rowData.comentarios}</div>
                            <div style={{fontSize:'10px'}}>De: {rowData.estadoSituacionInicial.descripcion} <span style={{fontSize:'16px'}}>&#8594;</span> {rowData.estadoSituacionFinal.descripcion}</div>
                            {
                                rowData.estado === "A" && <div style={{fontSize:'10px'}}> Aprobado por : {rowData.usuarioAprueba} el <Moment format="DD/MM/YYYY" date={rowData.fechaAprueba}></Moment></div>
                            }
                        </div>)
                        }
                    />
                    <Column title="Estado" key="estado" sorter={(a, b) => a.estado.localeCompare(b.estado)} 
                        filters= {[{text: "Ingresado", value: "I"}, {text: "Aprobado", value: "A"}]}
                        onFilter= {(value, record) => record.estado.indexOf(value) === 0}
                        defaultSortOrder="descend"
                        render={rowData => {
                        return(
                            (rowData.estado === "A" ?
                            <Tag color="green" style={{fontSize: '11px', lineHeight: '15px'}}>Aprobado</Tag>
                            :
                            <Tag style={{fontSize: '11px', lineHeight: '15px'}} >Ingesado</Tag>))
                        }
                    }/>
                    <Column title="#Activos" dataIndex="numeroActivos" width={3} key="numeroActivos" align="right" />
                    <Column title="Total" key="totalValor" width={5} align="right"
                        render={rowData => (<NumberFormat value={rowData.totalValor} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />)}
                     />
                    <Column key="id" render={rowData =>  (<Link to={{pathname: `/acta/${rowData.actaId}`}}><ZoomInOutlined/></Link>) }/>
               </Table>
           </Card>
        );
    }

}

export default Actas;