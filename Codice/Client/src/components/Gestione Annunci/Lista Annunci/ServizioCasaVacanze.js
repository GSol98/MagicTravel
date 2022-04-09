import React from "react";

const Servizio = props => {
    return (
        <div className="col-sm-3 col-3 m-1">
            <div className="d-flex justify-content-center align-items-center"> 
                <img src={props.src} alt={props.alt} title={props.alt} style={{height:"28px", width: "28px"}}/>
            </div>
            <p style={{textAlign: "center"}}> {`${props.annuncio[props.nome]}${props.aggiunzioni}`}</p>
        </div>
    );
}

export default Servizio;