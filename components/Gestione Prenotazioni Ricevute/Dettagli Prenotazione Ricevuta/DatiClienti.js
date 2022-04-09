import React from "react";

class DatiClienti extends React.Component{

    render() {

        //Creo l'array utenti e lo riempio con tutti gli utenti della prenotazione
        let utenti = [];
        let key = 1;
        for(let i of this.props.datiClienti) {
            utenti.push(
                <div className="my-3" key={key}>
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
                {utenti}
            </div>
        );
    }
}

export default DatiClienti;
