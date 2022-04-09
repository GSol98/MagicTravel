import React from "react";

const Servizio = props => {
    return ( 
        <p style={{fontSize:"1.3em", textAlign:"center"}}>
            <strong>{props.numStanze}</strong> camere da <strong>{props.postiLetto}</strong> posti
        </p>
    );
};

export default Servizio;