import React from "react";

const pagamentoTasse = props => {
    return (
    <div className="checkbox mb-3">
        <label className="font-italic">
            <input 
                name= "paga_tasse"
                type="checkbox" 
                value="TasseSi"
                onChange={props.handleChange}
                
            />
            Spunta se desideri pagare le tasse di soggiorno insieme al totale
        </label>
    </div>
    )
}
export default pagamentoTasse;