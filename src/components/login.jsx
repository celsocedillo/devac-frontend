import React, {useContext} from 'react'
import { Form, Input, Button, Row, Col } from 'antd';
import { IoPersonOutline } from 'react-icons/io5'
import UserContext from '../contexts/userContext';


const Login = () => {
    
    console.log('V Login');

    const [frmLogin]  = Form.useForm();
    const { login } = useContext(UserContext);

    const handleLogin = async () =>{
        console.log('1');
        await login(frmLogin.getFieldValue('txtLogin'), frmLogin.getFieldValue('txtPassword'))       
        setTimeout(()=>{}, 0);
        console.log('2', window.localStorage.getItem('sesionToken'));
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
                        <Input.Password placeholder="Password"></Input.Password>
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
