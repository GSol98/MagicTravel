import React from "react";

const Transazione = props => {

   //Imposto la variabile sotto, utile per dare la colorazione all'importo e 
   //distinguere uscite da entrate
    let statoColore;

    if(props.importo < 0) {
        statoColore = {color: 'gray'};
    }else{
        statoColore = {color: 'green'};
    }
  
     
    return (
        <div className="p-3" style={{border:'solid 1px black'}}>   
                <div className="row">
                    <div className="col-md-5 col-12 p-4 text-center">
                        <h4 className="m-0 font-italic">{props.descrizione}</h4> 
                    </div>

                    <div className="col-md-3 col 12 p-3">
                        <p className="m-0" style={{color: "#6C757D"}}> <b>{props.titolo}</b></p>
                        <p className="m-0"> Tipo struttura: {props.tipo_alloggio}</p>                        
                        
                    </div>
                    
                    <div className="col-md-4 col-12 p-3 ">
                        <p className="m-0"> Data: {props.data}</p>   
                        <p className="m-0"> Importo: <span style={statoColore}> <b>{props.importo}€</b></span></p>               
                    </div>
                </div> 
        </div>
                  
    );
}

export default Transazione;