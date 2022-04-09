import React from "react";

const TassaDiSoggiorno = props => {
    return (
        <div className="mt-5 col-sm-6 col-12">
            <label className="lead">Tassa di soggiorno&emsp;</label>
            <input 
                type="number"
                id="tassa_soggiorno" 
                name="tassa_soggiorno" 
                value={props.state.tassa_soggiorno}
                className="form-control"
                placeholder="€" 
                onChange={props.handleChange}
                required 
            />
            <div className="invalid-feedback">
                Ogni comune impone una tassa di soggiorno per ogni notte passata dai clienti nella
                struttura. L'inserimento è necessario per il calcolo del costo totale di un soggiorno.
            </div>
        </div>
    );
};

export default TassaDiSoggiorno;