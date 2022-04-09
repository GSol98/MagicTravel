import React from "react";

const Costo = props => {
    return(
        <div className="mt-5 col-sm-6 col-12">
            <label className="lead">Costo giornaliero&emsp;</label>
            <input 
                type="number"
                id="costo" 
                name="costo" 
                value={props.state.costo}
                className="form-control"
                placeholder="€" 
                onChange={props.handleChange}
                required 
            />
        </div>
    );
}

export default Costo;