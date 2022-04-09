import React from "react";

const Servizi = props => {
    return (
        <div style={{ marginTop: '80px' }} className="mb-2 col-xl-8 col-lg-9 col-md-10 col-sm-11 col-12">
            <h4>- Servizi principali</h4>
            <div style={{ marginTop: '50px' }} className="row">
                <div className="col-sm-3 col-6">
                    <div className="d-flex justify-content-center align-items-center">
                        <img src="/images/icon/icons8-casa-24.png" alt="dimensione alloggio" style={{ height: "28px", width: "28px" }} />
                    </div>
                    <p style={{ textAlign: "center" }}>
                        Dim alloggio: &nbsp; <strong>{props.state.dimensione_alloggio}mq</strong>
                    </p>
                </div>

                <div className="col-sm-3 col-6">
                    <div className="d-flex justify-content-center align-items-center">
                        <img src="/images/icon/icons8-porta-24.png" alt="numero stanze" style={{ height: "28px", width: "28px" }} />
                    </div>
                    <p style={{ textAlign: "center" }}>
                        Numero stanze: &nbsp; <strong>{props.state.numero_stanze}</strong>
                    </p>
                </div>

                <div className="col-sm-3 col-6">
                    <div className="d-flex justify-content-center align-items-center">
                        <img src="/images/icon/icons8-letto-vuoto-30.png" alt="numero posti letto" style={{ height: "28px", width: "28px" }} />
                    </div>
                    <p style={{ textAlign: "center" }}>
                        Posti letto: &nbsp; <strong>{props.state.numero_posti_letto} </strong>
                    </p>
                </div>

                <div className="col-sm-3 col-6">
                    <div className="d-flex justify-content-center align-items-center">
                        <img src="/images/icon/icons8-vasca-da-bagno-26.png" alt="numero bagni" style={{ height: "28px", width: "28px" }} />
                    </div>
                    <p style={{ textAlign: "center" }}>
                        Numero bagni: &nbsp; <strong>{props.state.numero_bagni}</strong>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Servizi;