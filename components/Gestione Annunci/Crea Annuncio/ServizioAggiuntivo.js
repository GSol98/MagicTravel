import React from "react";

const ServizioAggiuntivo = props => {
    return(
        <div>
            <div className="checkbox my-2">
                <label>
                    <input 
                        className="mr-2" 
                        type="checkbox" 
                        id={props.name} 
                        name={props.name} 
                        checked={props.state[props.name]}
                        onChange={props.handleChange}
                    />
                    {props.label}
                </label>
            </div> 
        </div>
    );
} 

export default ServizioAggiuntivo;