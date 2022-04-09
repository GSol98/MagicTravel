import React from "react";

const Servizi = props => {
    return (
        <div className="mt-5">

            <label className="lead mt-3">SERVIZI STRUTTURA</label>

            <div className="form-row">

                {/* COMPONENTE DIMENSIONE ALLOGGIO */}
                <div className="mt-4 col-lg-3 col-md-6 col-sm-12">
                    <label htmlFor="dimensioneAlloggio">Dimensione alloggio</label>
                    <input
                        type="number"
                        id="dimensione_alloggio"
                        name="dimensione_alloggio"
                        value={props.state.dimensione_alloggio}
                        className="form-control"
                        placeholder="(mq)"
                        onChange={props.handleChange}
                        required
                    />
                </div>

                {/* COMPONENTE NUMERO STANZE */}
                <div className="mt-4 col-lg-3 col-md-6 col-sm-12">
                    <label htmlFor="nStanze">Numero Stanze</label>
                    <input
                        type="number"
                        id="numero_stanze"
                        name="numero_stanze"
                        value={props.state.numero_stanze}
                        className="form-control"

                        onChange={props.handleChange}
                        required
                    />
                </div>

                {/* COMPONENTE NUMERO POSTI LETTO */}
                <div className="mt-4 col-lg-3 col-md-6 col-sm-12">
                    <label htmlFor="nPostiLetto">Numero posti letto</label>
                    <input
                        type="number"
                        id="numero_posti_letto"
                        name="numero_posti_letto"
                        value={props.state.numero_posti_letto}
                        className="form-control"
                        onChange={props.handleChange}
                        required
                    />
                </div>

                {/* COMPONENTE NUEMRO BAGNI */}
                <div className="mt-4 col-lg-3 col-md-6 col-sm-12">
                    <label htmlFor="nBagni">Numero bagni</label>
                    <input
                        type="number"
                        id="numero_bagni"
                        name="numero_bagni"
                        value={props.state.numero_bagni}
                        className="form-control"
                        onChange={props.handleChange}
                        required
                    />
                </div>
            </div>
        </div>
    );
};

export default Servizi;