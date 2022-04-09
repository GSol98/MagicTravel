import React from "react";
import Servizio from "./Servizio.js";
import contaStanze from "../../../functions/ContaStanze.js";

const ServiziBeB = props => {
    let numero_stanze = props.stanze.length;
    let riepilogo = contaStanze(props.stanze);
    let servizi = [];

    for (let i = 1; i <= riepilogo.length; i++) {
        if (riepilogo[i] !== 0 && riepilogo[i] !== undefined)
            servizi.push(<Servizio key={i} numStanze={riepilogo[i]} postiLetto={i} />);
    }

    return (
        <div style={{ marginTop: '80px' }} className="mb-2 col-xl-8 col-lg-9 col-md-10 col-sm-11 col-12">
            <h4>- Servizi principali</h4>
            <div className="row mt-2">
                <div className="col-sm-12 col-12 mt-5">
                    <div className="d-flex justify-content-center align-items-center">
                        <img src="/images/icon/icons8-porta-24.png" alt="numero stanze" style={{ height: "30px", width: "30px" }} />
                    </div>
                    <p style={{ textAlign: "center", fontSize: "1.2em" }}>
                        Numero Camere: &nbsp; <strong>{numero_stanze}</strong>
                    </p>
                </div>
            </div>
            <div> {servizi} </div>
        </div>
    );
};

export default ServiziBeB;
