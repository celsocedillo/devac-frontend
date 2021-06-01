import React, {useState, useEffect}  from "react";
// import { Link } from "react-router-dom";
// import moment from 'moment';
// import NumberFormat from "react-number-format";
import {  Modal } from 'antd';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faPlusSquare, faSearchPlus, faEllipsisH } from '@fortawesome/free-solid-svg-icons';

function ModalOficio(props){

    const [isOpen, setIsOpen]= useState(false);

    useEffect(() => {
        console.log("buscar aqui oficio")
    }, []);

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