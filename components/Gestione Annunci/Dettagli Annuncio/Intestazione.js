import React from "react";

const intestazione = props => {
    return (
        <div style={{textAlign: "center", marginTop:'50px'}}>
            <h1> {props.state.titolo} </h1>
            <div className="mt-3">
                <p style={{fontSize: "1.3em"}}> 
                    &nbsp; • &nbsp;
                    {props.state.tipo_alloggio}
                    &nbsp; • &nbsp;
                    <br />
                    {props.state.nome_comune}&nbsp;
                    ({props.state.nome_provincia}),&nbsp;&nbsp;
                    {props.state.nome_regione}
                    <br />
                    {props.state.indirizzo}, &nbsp;
                    {props.state.numero_civico} 
                </p>
            </div>
        </div>
    );
}

export default intestazione;