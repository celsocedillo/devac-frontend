
import React, { useContext } from 'react';
import { useHistory} from "react-router-dom";

import { Card, Col, Row, Button } from 'antd';

import UserContext  from '../contexts/userContext';
import { Fragment } from 'react';
import {  IoArrowBackOutline } from 'react-icons/io5';
import {FcFeedback} from 'react-icons/fc';

const Modulos = () => {

  const { setModulo } = useContext(UserContext);
  const history = useHistory();

  const gridStyle = {

    textAlign: 'center',
  };

  const listaModulos = [{id: 1, modulo: 'Correspondencia'}]

  const handleModulo = (modulo) =>{
    console.log("modulo", modulo);
    window.localStorage.setItem('sesionModulo', JSON.stringify(modulo))
    setModulo(modulo);
    modulo && history.push('/correspondencia/bandejaSumillas');
  }

    return (
      <Fragment>
        <Row gutter={16}>
         {
            listaModulos.map((e)=> 
           <Col span={3}  key={e.id}>
             <Card style={gridStyle}>
               <Button type='text' onClick={() => handleModulo(e)}>
                <FcFeedback style={{fontSize:60}}></FcFeedback>
                <div><span style={{fontSize:12}}>{e.modulo}</span></div>
               </Button>
             </Card>
          </Col>
          )
          }

        </Row>
      </Fragment>
    )
}

export default Modulos
