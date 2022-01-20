import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import moment from 'moment';
import NumberFormat from "react-number-format";

import { Card, Form, Input, Select, Row, Col, Button, 
         DatePicker, Table, AutoComplete, notification, 
         Modal, Descriptions, message, Spin, Alert, Space } from 'antd';
import { PlusCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined} from '@ant-design/icons';

const{TextArea} = Input;
const { Column } = Table;
const { confirm } = Modal;

//Date.prototype.toJSON = function() {return moment(this).format();}

class Acta extends React.Component {

    servidorAPI = process.env.REACT_APP_API_URL;
    formRef = React.createRef();
    focButton = React.createRef();
    focAuto = React.createRef();
    

    constructor(props) {
        super(props);
        this.state = {
            acta:{},
            loading: true,
            registroEdicion: true,
            lstEstados: [],
            lstFiltro: [],
            lstOptions: [],
            registroNuevo: true,
            selectedRowKeys : [],
            showModalAgregar: false,
            showModalAprobar: false,
            activosEliminar: [],
            activoSeleccionado: null,
            txtAuto: "",
            buttonLoading: false,
            cardLoading: true,
            submitLoading: false,
            actaValida: true,
            activosNoValidos: [],
        }

    }

    async componentDidMount(){
        //const xest = await fetch(`${this.servidorAPI}OtrosServicios/EstadoSituacionByUsuario/${localStorage.getItem("usuario")}`);
        const xest = await fetch(`${this.servidorAPI}otros/EstadosUsuario/${localStorage.getItem("usuario")}`);
        const res =(await xest.json()).data;
        res.map(m => {
            (m.idEstadoOrigen === m.idEstadoDestino) && this.setState({lstEstados: [...this.state.lstEstados, {id: m.idEstadoOrigen, label: m.estadoOrigen.descripcion}]})
        })

        if (this.props.match.params.id){
            this.setState({registroNuevo: false, cardLoading: true});
            //Buscar acta en base
            //const data = await fetch(`${this.servidorAPI}Acta/` + this.props.match.params.id);
            const data = await fetch(`${this.servidorAPI}acta/` + this.props.match.params.id);
            this.setState({acta: (await data.json()).data, cardLoading: false});
            console.log("acta", this.state.acta);
            this.cargaActa();
            //this.setState({loading: false})
        }
        this.setState({cardLoading: false});
    }

    async buscarActa(){
        this.setState({registroNuevo: false, cardLoading: true});
        //Buscar acta en base
        const data = await fetch(`${this.servidorAPI}Acta/` + this.props.match.params.id)
                    .then(async response => {
                        const data = await response.json();
                        if (response.status == 201){
                            this.setState({acta: data, cardLoading: false});
                            console.log("acta", this.state.acta);
                            this.cargaActa();
                        }else{
                            notification['error']({
                                message: 'Error',
                                description: `Error al buscar el acta [${data.error}]`
                            });
                        }
                    })
                    .catch(err => {
                        notification['error']({
                            message: 'Error',
                            description: `Error de servidor [${err}]`
                        });
                    });

    }

    cargaActa(){
        console.log("carga");
        this.formRef.current.setFieldsValue({
            actaId: this.state.acta.actaId,
            numeroActa: this.state.acta.numeroActa,
            fechaActa: moment(this.state.acta.fechaActa),
            comentario: this.state.acta.comentarios,
            estadoInicial: this.state.acta.estadoInicial,
            estadoFinal: this.state.acta.estadoFinal,
          });
        if (this.state.acta.estado === "A") this.setState({registroEdicion: false});
    }
    
    async submitForm(values){
        this.setState({submitLoading:true})
        let registro = {
            numeroActa: values.numeroActa,
            fechaActa: moment(values.fechaActa).toDate(),
            comentarios: values.comentario,
            estadoInicialId: values.estadoInicial,
            estadoFinalId: values.estadoFinal,
            //usuarioIngresa: localStorage.getItem("usuario"),
            //fechaIngresa: moment().toDate(),
            //totalValor: 0,
            //numeroActivos: 0,
            //estado: "I"
        }

        if (this.state.registroNuevo){
            registro = {...registro, 
                usuarioIngresa: localStorage.getItem("usuario"),
                fechaIngresa: moment().toDate(),
                totalValor: 0,
                numeroActivos: 0,
                estado: "I"
            }
            await this.insertActa(registro);
        }else{
            await this.updateActa(registro);
        }
        this.setState({submitLoading:false})

    }

    insertActa = async (registro) => {
        const insert = await fetch(`${this.servidorAPI}acta/`, {method: "post", headers: {'Content-Type':'application/json'}, body: JSON.stringify(registro)})
                      .then(async (response) => {
                        console.log("response", response);  
                        let resultado = await response.json();
                        resultado.data.detalle = [];
                        if (response.status === 201){
                            console.log("ok");
                            this.setState({acta: await resultado.data, registroNuevo: false});
                            //console.log("acta", this.state.acta);
                            //this.setState({acta: {...this.state.acta, detalle: []}});
                            //console.log("acta", this.state.acta);
                            notification['success']({
                                message: '',
                                description: `Acta grabada con exito`
                            });
                            this.cargaActa();
                        }else if (response.status === 501){
                            notification['error']({
                                message: 'Error',
                                description: `Error al crear el acta [${resultado.error.message}]`
                            });
                        }else{
                            notification['error']({
                                message: 'Error',
                                description: `Error desconocido`
                            });
                        }
                        
                      });
    }

    updateActa = async(registro) => {
        registro = {...registro, actaId: this.state.acta.actaId};
        console.log("registro", registro);
        const insert = await fetch(`${this.servidorAPI}acta/`, {method: "put", headers: {'Content-Type':'application/json'}, body: JSON.stringify(registro)})
                      .then(async (response) => {
                        let resultado = await response.json();
                        if (response.status === 201){
                            notification['success']({
                                message: '',
                                description: `Acta grabada con exito`
                            });
                        }else if (response.status === 501){
                            notification['error']({
                                message: 'Error',
                                description: `Error al actualizar el acta [${resultado.error.message}]`
                            });
                        }else{
                            notification['error']({
                                message: 'Error',
                                description: `Error desconocido`
                            });
                        }
                      }).catch(err => {
                        notification['error']({
                            message: 'Error',
                            description: `Error de servidor ${err}`
                        });
                      });
    }

    renderOption(item){
        return {
            value: item.descripcion, label: <div>{item.descripcion}</div>
        }
    }

    renderTitle = () => {
        return(
            <table style={{background:"#f5f5f5", border: "1px solid", width: "100%", fontSize: "10px", padding: "0px"}}>
                <thead>
                    <tr>
                        <th colSpan="3" style={{textAlign: "center", height:"17px", border: "1px solid #bfbfbf"}}>
                            Código
                        </th>
                        <th rowSpan="2" style={{textAlign: "center", border: "1px solid #bfbfbf"}}>
                        <div style={{height:"18px"}}>
                            Activo
                        </div>
                            
                        </th>
                    </tr>
                    <tr>
                        <th style={{height:"17px", border: "1px solid #bfbfbf"}} width="55px">Emapag</th>
                        <th style={{height:"17px", border: "1px solid #bfbfbf"}} width="55px">Conces.</th>
                        <th style={{height:"17px", border: "1px solid #bfbfbf"}} width="55px">Control</th>
                    </tr>
                </thead>
            </table>
        );
    }

    async handleSearch(value){
        console.log("form", this.formRef.current.getFieldValue("estadoInicial"));
        //const res = await fetch(`${this.servidorAPI}ActivoByFiltroCodigo/${value}?estadoSituacionId=${this.formRef.current.getFieldValue("estadoInicial")}`);
        const res = await fetch(`${this.servidorAPI}activo/FiltroByCodigo/${value}?estadoSituacionId=${this.formRef.current.getFieldValue("estadoInicial")}`);
        let data = await (res.json());
        data = data.data;
        //this.setState({lstFiltro: data});
        //console.log("search", value, "res", data);
        this.setState({lstOptions: [], activoSeleccionado: null})
        let opciones = [];
        await data.map(item => (
            opciones.push({label: (
                    <table style={{border: "1px solid #bfbfbf", width: "100%"}}>
                        <tbody>
                            <tr>
                                <td width="55px"> <span style={{fontSize:"10px"}}>{item.codigoEcapag}</span></td>
                                <td width="55px"> <span style={{fontSize:"10px"}}>{item.codigoConcesionaria}</span></td>
                                <td width="55px"> <span style={{fontSize:"10px"}}>{item.codigoActivoControl}</span></td>
                                <td >
                                    <div style={{width: "100px", fontSize:"10px", whiteSpace: "wrap", height:"18px"}}>
                                        <span style={{color: "green"}}>{item.tipoActivo}</span> , <span style={{color: "blueviolet"}}>{item.claseActivo}</span>
                                    </div>
                                    <div style={{width: "100px", fontSize:"10px", whiteSpace: "wrap", height:"18px" }}>
                                        {item.descripcion}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                ), 
            key: item.activoId, 
            value: item.activoId, 
            data: item})
            //this.setState({lstOptions: [...this.state.lstOptions, {label: item.descripcion, value: item.activoId}]})
        ));
        let x = [{label: this.renderTitle(), options: opciones}]
        this.setState({lstOptions: x})
        //console.log("autocom", this.state.lstOptions);
    }

    onSelectAutoComplete = async (value, options) =>{
        console.log("onselect", options);
        if (this.state.acta.detalle?.length > 0){
            let buscarActivo= await this.state.acta.detalle.filter(x => x.activoId === options.data.activoId);
            if (buscarActivo.length == 0 ){
                this.setState({activoSeleccionado: options.data});
                setTimeout(() => {
                    this.focButton.current.focus();
                }, 200)
            }else{
                message.warning(`Activo ${options.data.descripcion.substring(0,50)}, ya está en la lista `)
                this.setState({txtAuto: ""})                
            }
        }else{
            this.setState({activoSeleccionado: options.data});
                setTimeout(() => {
                    this.focButton.current.focus();
                }, 200)
        }
    }

    onAceptarAgregar = async () => {
        let registro = {
            actaId: this.state.acta.actaId,
            activoId: this.state.activoSeleccionado.activoId,
            codigo: this.state.activoSeleccionado.codigoEcapag,
            codigoConcesionaria: this.state.activoSeleccionado.codigoConcesionaria,
            usuarioIngresa: localStorage.getItem("usuario"),
            fechaIngreso: moment().toDate(),
            //fechaIngreso: moment(new Date()).format("DD-MM-YYYY"),
            estado: "A",
            fechaUltCambio : this.state.activoSeleccionado.fechaUltCambio,
            valorCompraIva : this.state.activoSeleccionado.valorCompra 
        }
        this.setState({buttonLoading: true});
        console.log("detalle", registro);
        //Insertar el activo
        const insert = await fetch(`${this.servidorAPI}Acta/activo`, {method: "post", headers: {'Content-Type':'application/json'}, body: JSON.stringify(registro)})
                             .then( async (response) => {
                                 let resultado = await response.json();
                                 if (response.status == 201){
                                    message.success("Activo Ingresado");
                                    let activo = {
                                        claseActivo: this.state.activoSeleccionado.claseActivo,
                                        tipoActivo : this.state.activoSeleccionado.tipoActivo,
                                        codigoActivoControl: this.state.activoSeleccionado.codigoActivoControl,
                                        codigoEcapag: this.state.activoSeleccionado.codigoEcapag,
                                        codigoConcesionaria: this.state.activoSeleccionado.codigoConcesionaria,
                                        descripcion: this.state.activoSeleccionado.descripcion
                                    }
                                    registro = {...registro, 
                                        id: resultado.data.activoId,
                                        activo: activo}
                                    let detalle = [...this.state.acta.detalle, registro];
                                    let num = this.state.acta.numeroActivos+1;
                                    let val = this.state.acta.totalValor + registro.valorCompraIva
                                    this.setState({acta: {...this.state.acta, numeroActivos: num, totalValor: val, detalle: detalle}});
                                    //let inputAutoComplete = document.getElementsByName('txtAuto');
                                    //inputAutoComplete[0].setAttribute('value', "");
                                    //inputAutoComplete[0].focus();
                                    setTimeout(() => {
                                        this.focAuto.current.focus();
                                        this.focAuto.current.value = "";
                                    }, 200)  
                                    this.setState({lstOptions: [], activoSeleccionado: null, txtAuto: "", buttonLoading: false})    
                                 }else if (response.status == 501){
                                    this.setState({lstOptions: [], activoSeleccionado: null, txtAuto: "", buttonLoading: false})    
                                    message.error("Error al ingresar el activo, " + resultado.error)
                                 }
                             })
    }

    onChangeAuto = async (valor) => {
        //console.log("onchange");
        this.setState({txtAuto: valor});
    }

    onClickAgregar = () =>{
        this.setState({showModalAgregar: true, lstOptions: [], activoSeleccionado: null, txtAuto: ""})    
    }

    onClickEliminar = () => {
        confirm({
            title: "Eliminar",
            icon: <ExclamationCircleOutlined/>,
            content: "Seguro desea eliminar los activos",
            onOk: async () => {
                this.eliminarActivos();
            },
            onCancel(){
                console.log("cancelar");
            }
        });
    }

    async eliminarActivos(){
        let listaEliminar = [];
        let lista = this.state.acta.detalle;
        let lis = this.state.acta.detalle.filter(x => this.state.selectedRowKeys.includes(x.actadetId));
        console.log("listaEliminar", lis);
        const borrar = await fetch(`${this.servidorAPI}acta/${this.state.acta.actaId}`, {method: "put", headers: {'Content-Type':'application/json'}, body: JSON.stringify(lis)})
            .then( async (response) => {
                console.log("response", response);  
                let resultado = await response.json();
                console.log("resultado", resultado);
                if (response.status == 201){
                    console.log("resultado", resultado);
                    notification['success']({
                        message: 'Mensaje',
                        description: `Activos eliminados`
                    });
                    let lis = this.state.acta.detalle.filter(x => !this.state.selectedRowKeys.includes(x.actadetId));
                    this.setState({acta: {...this.state.acta, numeroActivos: resultado.data.numeroActivos, totalValor: resultado.data.totalValor, detalle: lis}, selectedRowKeys: []});
                }else if (response.status == 501){
                    console.log("error", resultado);
                    notification['error']({
                        message: 'Error',
                        description: `Error al eliminar activos [${resultado.error.message}]`
                    });
                }
            }).catch(err => {
                notification['error']({
                    message: 'Error',
                    description: `Error de servidor ${err}`
                });
            });
    }

    onSelectActivos = async selectedRowKeys  => {
        console.log("seleccionados change", selectedRowKeys);
        await this.setState({selectedRowKeys });
        console.log("seleccionados", this.state.selectedRowKeys );
    }

    handleCancel =  () => {
        this.setState({showModalAgregar: false});
    }

    handleCancelAprobar =  () => {
        this.setState({showModalAprobar : false});
    }

    onClickAprobar = async () => {
        this.setState({submitLoading:true})
        const valida = await fetch(`${this.servidorAPI}acta/Valida/${this.state.acta.actaId}`, {method: "post"})
                .then(async(response) => {
                    this.setState({submitLoading:false, showModalAprobar: true});
                    const result = await response.json();
                    //console.log("resul", result.data[0]);
                    if (response.status == 201){
                        // if (result.respuesta.implicitResults[0].length == 0){
                        if (result.data[0].length == 0){
                            this.setState({actaValida: true})
                        }else{
                            // this.setState({actaValida: false, activosNoValidos: result.respuesta.implicitResults[0]})
                            this.setState({actaValida: false, activosNoValidos: result.data[0]})
                        }
                    }else if (response.status == 501){
                        console.log("error valida", result);
                        this.setState({submitLoading:false, actaValida: false});
                        notification['error']({
                            message: '',
                            description: `Error en la validación del acta, ${result.error}`
                        });
                    }
                }).catch(err => {
                    notification['error']({
                        message: 'Error',
                        description: `Error de servidor ${err}`
                    });
                  });
                
    }

    onClickAceptarAprobar = async() => {
        this.setState({submitLoading:true})
        const valida = await fetch(`${this.servidorAPI}acta/aprueba/${this.state.acta.actaId}/${localStorage.getItem("usuario")}`, {method: "post"})
                .then(async(response) => {
                    const result = await response.json();
                    console.log("valida", response);
                    console.log("resul", result);
                    if (response.status == 201){
                        //Buscar acta en base
                        const data = await fetch(`${this.servidorAPI}acta/` + this.state.acta.actaId);
                        
                        this.setState({acta: (await data.json()).data, cardLoading: false, submitLoading:false, showModalAprobar: false});
                        console.log("acta", this.state.acta);
                        this.cargaActa();
                        notification['success']({
                            message: '',
                            description: `Acta aprobada con exito`
                        });

                    }else if (response.status >= 501){
                        this.setState({submitLoading:false});
                        notification['error']({
                            message: '',
                            description: `Error en la aprobación del acta, ${result.error}`
                        });
                    }
                }).catch(err => {
                    notification['error']({
                        message: 'Error',
                        description: `Error de servidor ${err}`
                    });
                });

    }

    render(){
        //let lista=this.state.acta.detalle
        let {loading, lstFiltro, lstOptions, selectedRowKeys } = this.state
        const rowSelection = {
            selectedRowKeys , 
            onChange: this.onSelectActivos
        }
        
        return(
        <Fragment>
            <Spin spinning={this.state.submitLoading}>
            <Card title="Acta" loading={this.state.cardLoading}  >
                <Form 
                    layout="horizontal"
                    size="small"
                    onFinish={(values)=>this.submitForm(values)}
                    onFinishFailed={this.onFinishFailed}
                    ref={this.formRef}
                >
                    <Row >
                        <Col span={16}>
                            <Row>
                                <Col span={12}>
                                    <Form.Item label="Fecha acta :" name="fechaActa" labelCol={{span: 10}}
                                        rules={[{
                                            required: true,
                                            message:"Ingresar fecha"
                                        }]}
                                    >
                                        <DatePicker disabled={!this.state.registroEdicion} format="DD/MM/YYYY" allowClear={false}/>
                                    </Form.Item>
                                </Col>
                                
                                <Col span={12}>
                                    <Form.Item label="Id" name="actaId" labelCol={{span: 10  }}
                                    >
                                        <Input readOnly disabled  style={{width: 140}}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Col span={24}>
                                <Form.Item label="Acta :" name="numeroActa"  labelCol={{span: 5}}
                                    rules={[
                                        {required: true,
                                         message:"Ingresar acta"},
                                        {min: 5,
                                        message:"Ingrese un nombre mas descriptivo"}
                                        ]}
                                  >
                                    <Input disabled={!this.state.registroEdicion} />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="Comentario :" name="comentario" labelCol={{span: 5}} 
                                    rules={[{required: true,message:"Ingresar comentario"},
                                            {min:10, message:"Ingrese un comentario mas descriptivo"}
                                ]}
                                >
                                    <TextArea rows={2} disabled={!this.state.registroEdicion} value={this.state.acta?.comentarios}/>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item  label="Estado inicial :" name="estadoInicial" labelCol={{span: 5}} 
                                    rules={[{required: true, message:"Seleccionar un estado"},
                                    ({ getFieldValue }) => ({
                                        validator(rule, value) {
                                        if (getFieldValue('estadoFinal') === value) {
                                            return Promise.reject('El estado inicial no puede ser igual al estado final');  
                                        }
                                        return Promise.resolve();
                                        }
                                    })
                                    ]}      
                                                                 
                                >
                                    <Select disabled={(!this.state.registroEdicion || (this.state.acta.detalle?.length > 0))}  value={this.state.acta.estadoInicial}>
                                    {this.state.lstEstados.map(item => (
                                        <Select.Option key={item.id} value={item.id}>
                                            {item.label}
                                        </Select.Option>
                                    ))}
                                </Select>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="Estado final :" name="estadoFinal" labelCol={{span: 5}} 
                                        rules={[{
                                        required: true,
                                        message:"Seleccionar un estado"
                                        }]}                                                    
                                >
                                <Select disabled={!this.state.registroEdicion} value={this.state.acta.estadoFinal}>
                                    {this.state.lstEstados.map(item => (
                                        <Select.Option key={item.id} value={item.id}>
                                            {item.label}
                                        </Select.Option>
                                    ))}
                                </Select>
                                </Form.Item>
                            </Col>
                            <Form.Item labelCol={{span: 8}} wrapperCol={{offset: 5, span: 16}}>
                                <Button size="default" type="primary" htmlType="submit" disabled={this.state.acta.estado === "A"}>Grabar</Button>
                                {
                                    (localStorage.getItem("aprobar") == "S" && this.state.acta.estado == "I" ) &&
                                    <Button size="default" type="default" style={{color: "green"}} disabled={this.state.acta.detalle?.length == 0} onClick={() => this.onClickAprobar()} >Aprobar</Button>
                                }
                                
                                <Link to={{pathname: `/actas`}}><Button size="default" type="secondary" >Regresar</Button></Link>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Descriptions size='small' style={{paddingLeft: "25px"}} >
                                <Descriptions.Item label="Ingresado por">{this.state.acta.usuarioIngresa}</Descriptions.Item>
                            </Descriptions>
                            <Descriptions style={{paddingLeft: "25px"}} >
                                <Descriptions.Item label="El día">{moment(this.state.acta.fechaIngresa).format("DD/MM/YYYY")}</Descriptions.Item>
                            </Descriptions>
                            { (this.state.acta.estado == 'A') &&
                                <div>
                            <Descriptions size='small' style={{paddingLeft: "25px"}} >
                                <Descriptions.Item label="Aprobado por">{this.state.acta.usuarioAprueba}</Descriptions.Item>
                            </Descriptions>
                            <Descriptions style={{paddingLeft: "25px"}} >
                                <Descriptions.Item label="El día">{moment(this.state.acta.fechaAprueba).format("DD/MM/YYYY")}</Descriptions.Item>
                            </Descriptions>

                                </div>

                            }
                        </Col>
                    </Row>
                </Form>
            </Card>

            <Card title="Lista de activos">
                {(this.state.acta.estado == "I") &&
                    <div>
                        <Button type="default" size="small" icon={<PlusCircleOutlined ></PlusCircleOutlined>} onClick={() => this.onClickAgregar()}> Agregar</Button>
                        <Button type="default" size="small" disabled={this.state.selectedRowKeys.length === 0} onClick={() => this.onClickEliminar()} icon={<CloseCircleOutlined style={{color: "red"}}></CloseCircleOutlined>}> Eliminar</Button>
                    </div>                
                }
                
                <Table dataSource={this.state.acta.detalle} 
                       size="small" 
                       pagination={false} 
                       rowSelection={rowSelection} 
                       rowKey="actadetId" 
                       scroll={{y: window.innerHeight - 400 }}
                       footer={() =>         
                        <div style={{display:"table", width: "100%"}}>
                            <div style={{display:"table-cell", width: "60px"}}>
                                #Activos
                            </div>
                            <div style={{display:"table-cell", width: "60px"}}>
                                {this.state.acta.numeroActivos}
                            </div>
                            <div style={{display:"table-cell", textAlign:"right", paddingRight: "30px" }}>
                                Total
                            </div>
                            <div style={{display:"table-cell", width: "30px", paddingRight: "15px"}}>
                                {<NumberFormat value={this.state.acta.totalValor} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />}
                            </div>                            
                        </div>
                       
            }
                >
                    <Column title="ActivoId" dataIndex="activoId" key="id" width={50}  />
                    <Column title="CodEma" dataIndex="codigo" width={50}/>
                    <Column title="CodConc." dataIndex="codigoConcesionaria" key="codigo" width={60} />
                    <Column title="Tipo" render={rowData => (rowData.activo?.tipoActivo)} ellipsis={true} />
                    <Column title="Clase" render={rowData => (rowData.activo?.claseActivo)} ellipsis={true} />
                    <Column title="Activo" render={rowData => (rowData.activo?.descripcion?.substring(0,50))} ellipsis={true} />
                    <Column title="Valor" align="right" 
                    render={rowData => (<NumberFormat value={rowData.valorCompraIva} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />)}
                    />
                </Table>
            </Card>

            <Modal
                title="Agregar activos"
                style={{top:20}}
                visible={this.state.showModalAgregar}
                width={800}
                onCancel={this.handleCancel}
                footer={null}
            >
                    
                        <AutoComplete style={{width: '100%'}}
                        autoFocus={true}
                        placeholder="Buscar por código" 
                        onSearch={(value)=> this.handleSearch(value)} 
                        options={lstOptions} 
                        onChange={async () => await this.onChangeAuto()}
                        value={this.state.txtAuto}
                        notFoundContent={<Spin/>}
                        onSelect={(value, options) => this.onSelectAutoComplete(value, options)}
                        >
                            <Input ref={this.focAuto}></Input>
                        </AutoComplete>
                    
                    {
                        this.state.activoSeleccionado &&
                        <div>
                            <Descriptions bordered size="small" title="Datos del activo"> 
                                <Descriptions.Item label="Cod.Emapag">{this.state.activoSeleccionado.codigoEcapag}</Descriptions.Item>
                                <Descriptions.Item label="Cod.Conces">{this.state.activoSeleccionado?.codigoConcesionaria}</Descriptions.Item>
                                <Descriptions.Item label="Cod.Control">{this.state.activoSeleccionado?.codigoActivoControl}</Descriptions.Item>
                                <Descriptions.Item label="Tipo">{this.state.activoSeleccionado?.tipoActivo}</Descriptions.Item>
                                <Descriptions.Item label="Clase" span={2}>{this.state.activoSeleccionado?.claseActivo}</Descriptions.Item>
                                <Descriptions.Item label="Descripcion" span={3}>{this.state.activoSeleccionado?.descripcion}</Descriptions.Item>
                            </Descriptions>
                            <Button size="small" type="primary" ref={this.focButton} onClick={() => this.onAceptarAgregar()}
                                loading={this.state.buttonLoading}
                            >
                                Agregar
                            </Button>
                        </div>

                    }
            </Modal>

            <Modal                 
                title="Aprobación de acta"
                style={{top:30}}
                visible={this.state.showModalAprobar}
                width={800}
                onCancel={this.handleCancelAprobar}
                footer={null}
            >
                {
                    this.state.actaValida 
                    ? 
                    <div>
                        <Alert
                        message="La validación del acta fue satisfactoria"
                        type="info"
                        showIcon
                        />
                            <div style={{padding: "15px"}}>
                                ¿Seguro desea aprobar el acta?
                            </div>
                            <div style={{padding: "15px"}}>
                            <Button type="primary" size="small" onClick={this.onClickAceptarAprobar} > Aceptar</Button>
                            <Button type="default" size="small" onClick={this.handleCancelAprobar} > Cancelar</Button>
                            </div>
                    </div>
                    :
                    <div>
                        <Alert
                        message="La validación del acta no fue satisfactoria"
                        type="warning"
                        showIcon
                        />
                        <br></br>
                        Los siguientes activos no se encuentran en el estado de situacion requerido:
                        <br></br>
                        <Table 
                            dataSource={this.state.activosNoValidos} 
                            size="small" 
                            pagination={false} 
                            rowKey="CODIGO" 
                            scroll={{y: 150 }}
                        >
                            <Column title="Codigo" dataIndex="CODIGO" key="CODIGO" width={50}  />
                            <Column title="Tipo" dataIndex="TIPO_ACTIVO"  width={90}  />
                            <Column title="Clase" dataIndex="CLASE_ACTIVO" width={90}  />
                            <Column title="Activo" dataIndex="DESCRIPCION" key="DESCRIPCION"  />

                        </Table>
                    </div>

                }



            </Modal>
            </Spin>
        </Fragment>
    
        )
}

}

export default Acta