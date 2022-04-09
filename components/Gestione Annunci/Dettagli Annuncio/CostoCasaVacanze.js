import React from "react";

const Costo = props => {
    return (
        <div style={{ marginTop: '80px' }} className="col-xl-8 col-lg-9 col-md-10 col-sm-11 col-12">
            <h4>- Costi alloggio</h4>
            <div className="ml-5 mt-4">
                <p style={{ fontSize: "1.2em" }}>Tassa di soggiorno: <strong>{props.state.tassa_soggiorno}€</strong>/giorno</p>
                <p style={{ fontSize: "1.2em" }}>Prezzo per notte: <strong>{props.state.costo}€</strong></p>
            </div>
        </div>
    );
}

export default Costo;