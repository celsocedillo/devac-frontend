import React, {useState, useEffect, Fragment}  from "react";
import {  useParams, Link, Route } from "react-router-dom";

const Oficio = () => {
    console.log("Inicio");
    const [oficio, setOficio] = useState(null)
    const servidorAPI = process.env.REACT_APP_API_URL;
    const params = useParams();
    
    console.log("Inicio2");
    useEffect(() => {

            console.log(`Buscar con el parametro${params.id}` )
    }, [])


    return (
        <Fragment>
            oficio
        </Fragment>
    )
}

export default Oficio
