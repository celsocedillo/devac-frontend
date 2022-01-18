import React, {useState, useEffect}  from "react";
import {  Modal } from 'antd';

function ModalOficio(props){

    const [isOpen, setIsOpen]= useState(false);

    useEffect(() => {
        props.show && 
        console.log("buscar aqui oficio")
    }, [props.show]);

    return(
        <Modal
            title="OFicio"
            visible={props.show}
            onCancel={() => props.onClose(false)}
            width={1200}
            footer={null}
            style={{top:10}}        
        >
            Oficio
        </Modal>
    );
}

export default ModalOficio;