import React from "react";
import GestisciPdf from "../../../common/GestisciPDF.js";

class DatiClienti extends React.Component{

    render() {
        
        let utenti = [];
        let key = 1;
        for(let i of this.props.datiClienti) {
            utenti.push(
                <div className="my-4" key={key}>
                    <h5 style={{textAlign: "center", fontStyle: "italic"}}>{i.nome} {i.cognome}</h5>
                    <div style={{textAlign: "justify"}}>
                        <p>Data di nascita: {i.data_di_nascita}</p>
                        <p>Codice fiscale: {i.codice_fiscale}</p>
                        <p>{i.numero_telefono ? `Numero di telefono: ${i.numero_telefono}` : ""}</p>
                    </div>
                   
                </div>
            );
            key++;
        }
        return(
            <div>
                <div>
                    {utenti}
                </div>
                {this.props.gestione_legale === 0 ?
                    <GestisciPdf 
                    id_prenotazione = {this.props.id_prenotazione}
                    tipo = {this.props.tipo}
                    /> : ''
                }                
            </div>
        );
    }
}

export default DatiClienti;