import React, {useContext, useEffect, useState} from 'react'
import { useHistory } from "react-router-dom";
import { Form, Input, Button, Row, Col } from 'antd';
import { IoPersonOutline } from 'react-icons/io5'
import UserContext from '../contexts/userContext';


const Login = () => {
    

    const [frmLogin]  = Form.useForm();
    const { login, setUsuario } = useContext(UserContext);
    const history = useHistory();
    const [logeado, setLogeado] = useState(false)

    useEffect(()=>{
        setUsuario(null);
        window.localStorage.removeItem('sesionUsuario');
    }, [])

    const handleLogin = async (e) =>{
        const userData = await login(frmLogin.getFieldValue('txtLogin'), frmLogin.getFieldValue('txtPassword'));
        console.log('logeado');
        setLogeado(true);
        userData && history.push('/listaModulos');
    }


    return (
        <div style={{width:'328px', margin: '0 auto', paddingTop:'50px'}}>
            <Form form={frmLogin}>
                <Row>
                <Col span={24}>
                    <Form.Item name='txtLogin'>
                        <Input placeholder="Usuario"  suffix={<IoPersonOutline/>}></Input>
                    </Form.Item>
                    <Form.Item name='txtPassword' >
                        <Input.Password placeholder="Password" onPressEnter={handleLogin}></Input.Password>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" size="small" style={{width:'100%'}} onClick={handleLogin}>Ingreso</Button>
                    </Form.Item>
                </Col>
                </Row>
            </Form>            
        </div>
    )
}

export default Login
