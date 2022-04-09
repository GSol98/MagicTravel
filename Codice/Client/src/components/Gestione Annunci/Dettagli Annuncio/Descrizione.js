import React from "react";

const Descrizione = props => {
    return (
        <div style={{ marginTop: '80px' }} className="mb-3 col-xl-8 col-lg-9 col-md-10 col-sm-11 col-12">
            <h4>- Descrizione alloggio</h4>
            <div style={{ border: "1px solid lightgrey", borderRadius: "5px" }} className='ml-3 mt-4'>
                <p className="p-3" style={{ fontSize: "1.1em" }}>{props.state.descrizione}</p>
            </div>
        </div>
    );
}

export default Descrizione;