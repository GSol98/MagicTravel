import React from "react";

const infoCamere = props => {
    return (
        <div className="mt-4 row border-bottom">
            <div className="row col-12 col-sm-12 col-md-8">
                <input
                    type="number"  
                    name={`C${props.count}`}
                    placeholder="N Camere"
                    className="form-control col-12 col-sm-12 col-md-4 my-1" 
                    onChange={props.handleChange} 
                    required 
                />           
                &nbsp; camere da &nbsp;
                <input
                    type="number"  
                    name={`L${props.count}`}
                    placeholder="N Posti Letto"
                    className="form-control col-12 col-sm-12 col-md-4 my-1" 
                    onChange={props.handleChange} 
                    required 
                />   
                <div className="invalid-feedback">
                    ES. 5 camere da 4 posti letto
                </div>         
            </div>
            <div className="mb-2 col-12 col-sm-12 col-md-4">
                <div className="row">
                    Prezzo: &nbsp;&nbsp;
                    <input
                        type="number"
                        name={`P${props.count}`}
                        className="form-control col-8 col-sm-8 col-md-4 my-1" 
                        onChange={props.handleChange} 
                        required 
                    />
                    <div className="invalid-feedback">
                        Prezzo per notte in queste stanze
                    </div>
                </div>    
            </div>     
        </div>
    );
}

export default infoCamere;