import React from "react";

class DettagliRichiesta extends React.Component {
    //==============================================
    //Funzione giorni_tra()
    //==============================================

    //Calcola la differenza tra due date
    giorni_tra = (date1, date2) => {
        var ONE_DAY = 1000 * 60 * 60 * 24;
        var date1_ms = date1.getTime();
        var date2_ms = date2.getTime();
        var difference_ms = date1_ms - date2_ms;
        return Math.round(difference_ms/ONE_DAY);
    }

    render() {
        let dettagli = this.props.dettagli;
        let tipo = this.props.tipo;
        let giorniPernottamento = this.giorni_tra(new Date(dettagli.check_out), new Date(dettagli.check_in));
        
        let nota;
        if(dettagli.stato === "accettata") {
            nota = <label className = "text-danger"> Nota: procedendo con il pagamento, le stanze prenotate nella stessa richiesta, verranno pagate.</label>
        }

        
        if(tipo === 'C') {

            return(
                <div id='dettagliRichiestaPrenotazione'>
                    <h4><b>Dettagli prenotazione</b></h4>
                    <p className="mt-3">Data richiesta: {dettagli.data_richiesta}</p>
                    <p><b style={{color:"blue" }}>Check-in:</b> {dettagli.check_in}</p>
                    <p><b style={{color:"blue" }}>Check-out: </b>{dettagli.check_out}</p>
                    <p>Numero partecipanti: {dettagli.numero_partecipanti}</p>
                    <p>Giorni di pernottamento: {giorniPernottamento}</p>
                    <p>Costo: <b>{dettagli.prezzo_con_tasse}€</b></p>
                    <p>Tasse di soggiorno: <b>{dettagli.tassa_soggiorno*dettagli.numero_partecipanti*giorniPernottamento}€</b></p>
                    <p><b>Le tasse di soggiorno {(dettagli.prezzo_no_tasse !== dettagli.prezzo_con_tasse) ? '' : 'non'} sono comprese nel costo</b></p>
                    <br/>
                    <h4><b>Dettagli immobile</b></h4>
                    <p className="mt-3">Regione: {dettagli.nomeRegione}</p>
                    <p>Comune di {dettagli.nomeComune}, {dettagli.nomeProvincia}.</p>
                    <p>Indirizzo: {dettagli.indirizzo}, {dettagli.numero_civico}</p>
                    <h5 className="font-weight-semibold" >Descrizione:</h5>
                    <p className="font-italic" style={{textAlign: "justify", width: "70%" }}>{dettagli.descrizione}</p>
                    <p className="mt-5">Dimensione alloggio: {dettagli.dimensione_alloggio}mq</p>
                    <p>Numero stanze: {dettagli.numero_stanze}</p>
                    <p>Posti letto: {dettagli.numero_posti_letto}</p>
                    <p>Numero bagni: {dettagli.numero_bagni}</p>
                </div>
                 
            );
        }
        else {

            return(
                <div id='dettagliRichiestaPrenotazione'>
                    <h4><b>Dettagli prenotazione</b></h4>
                    <p className="mt-3">Data richiesta: {dettagli.data_richiesta}</p>
                    <p><b style={{color:"blue" }}>Check-in:</b> {dettagli.check_in}</p>
                    <p><b style={{color:"blue" }}>Check-Out:</b> {dettagli.check_out}</p>
                    <p>Numero partecipanti: {dettagli.numero_partecipanti}</p>
                    <p>Giorni di pernottamento: {giorniPernottamento}</p>
                    <p style={{width: "70%"}}>Costo: <b>{dettagli.prezzo_con_tasse}€ <br/>(Si riferisce all'ammontare totale della prenotazione ovvero alla somma dei costi di tutte le stanze prenotate nella medesima richiesta.)</b></p>
                    <p>Tasse di soggiorno: <b> {dettagli.tassa_soggiorno*dettagli.numero_partecipanti*giorniPernottamento}€</b></p>
                    <p><b>Le tasse di soggiorno {(dettagli.prezzo_no_tasse !== dettagli.prezzo_con_tasse) ? '' : 'non'} sono comprese nel costo</b></p>
                    <br/>
                    <h4><b>Dettagli b&b</b></h4>
                    <p className="mt-3">Regione: {dettagli.nomeRegione}</p>
                    <p>Comune di {dettagli.nomeComune}, {dettagli.nomeProvincia}.</p>
                    <p>Indirizzo: {dettagli.indirizzo}, {dettagli.numero_civico}</p>
                    <h5 className="font-weight-semibold" >Descrizione:</h5>
                    <p className="font-italic" style={{textAlign: "justify", width: "70%"}}>{dettagli.descrizione}</p>
                    <br/>
                    <h4><b>Dettagli stanza n. {dettagli.numero_stanza}</b></h4>
                    <p className="mt-3">Posti letto: {dettagli.posti_letto}</p>
                    <p><b>Costo giornaliero: {dettagli.prezzo}€</b></p>
                    <br/>
                    {nota}    
                </div>
            );
        }
    }
}
export default DettagliRichiesta;