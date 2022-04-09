import React from "react";

class DettagliRichiesta extends React.Component {

    render() {

        //Creo un array con tutti i dati aggiuntivi e seleziono quelli che presenta l'annuncio
        let dettagli = this.props.dettagli;
        let aggiunti = ['wifi', 'elevisore', 'ascensore', 'parcheggio',
                        'animali', 'fumatori', 'ariaCondizionata', 'riscaldamenti',
                        'trasporti','microonde', 'lavastoviglie', 'frigorifero', 'forno',
                        'lavabiancheria', 'asciugatrice', 'phon', 'ferroDaStiro', 'telecamere',
                        'estintore', 'allarmeFurto', 'allarmeIncendio'];
        let datiAggiuntivi = [];
        for(let i of aggiunti) {
            if(dettagli[i] === 1)
                datiAggiuntivi.push(
                    <p key={Math.random()}>- {i.toLowerCase()}</p>
                );
        }

        //Calcolo giorni pernottamento
        let giorniPernottamento = Math.floor((new Date(dettagli.check_out) - new Date(dettagli.check_in))/(1000*60*60*24));

        if(this.props.tipo === 'C') {

            return(
                <div id='dettagliRichiestaPrenotazione'>
                    <h4><b>Dettagli richiesta</b></h4>
                    <p className="mt-3">Data richiesta: {dettagli.data_richiesta}</p>
                    <p><b style={{color:"blue" }}>Check-in:</b> {dettagli.check_in}</p>
                    <p><b style={{color:"blue" }}>Check-out:</b> {dettagli.check_out}</p>
                    <p>Numero partecipanti: {dettagli.numero_partecipanti}</p>
                    <p><b>Costo: {dettagli.prezzo_con_tasse}€</b></p>
                    <p><b>Tasse di soggiorno: {dettagli.tassa_soggiorno*dettagli.numero_partecipanti*giorniPernottamento}€</b></p>
                    <p><b>Le tasse di soggiorno {(dettagli.prezzo_no_tasse !== dettagli.prezzo_con_tasse) ? '' : 'non'} sono comprese nel costo</b></p>
                    <br/>
                    <h4><b>Dettagli immobile</b></h4>
                    <p className="mt-3">Luogo stabile: {dettagli.nome}</p>
                    <p>Indirizzo: {dettagli.indirizzo} {dettagli.numero_civico}</p>
                    <p>Descrizione:</p>
                    <div style={{width: "70%"}}>
                        {dettagli.descrizione}
                    </div>
                    <p className="mt-5">Dimensione alloggio: {dettagli.dimensione_alloggio}mq</p>
                    <p>Numero stanze: {dettagli.numero_stanze}</p>
                    <p>Posti letto: {dettagli.numero_posti_letto}</p>
                    <p>Numero bagni: {dettagli.numero_bagni}</p>
                    <p>Dati aggiuntivi:</p>
                    <div>{datiAggiuntivi.length === 0 ? 'Nessun dato aggiuntivo' : datiAggiuntivi}</div>
                </div>
            );
        }
        else {

            return(
                <div id='dettagliRichiestaPrenotazione'>
                    <h4><b>Dettagli richiesta</b></h4>
                    <p className="mt-3">Data richiesta: {dettagli.data_richiesta}</p>
                    <p><b style={{color:"blue" }}>Check-in:</b> {dettagli.check_in}</p>
                    <p><b style={{color:"blue" }}>Check-out:</b> {dettagli.check_out}</p>
                    <p>Numero partecipanti: {dettagli.numero_partecipanti}</p>
                    <p><b>Costo: {dettagli.prezzo_con_tasse}€</b></p>
                    <p><b>Tasse di soggiorno: {dettagli.tassa_soggiorno*dettagli.numero_partecipanti*giorniPernottamento}€</b></p>
                    <p><b>Le tasse di soggiorno {(dettagli.prezzo_no_tasse !== dettagli.prezzo_con_tasse) ? '' : 'non'} sono comprese nel costo</b></p>
                    <br/>
                    <h4><b>Dettagli b&b</b></h4>
                    <p className="mt-3">Luogo stabile: {dettagli.nome}</p>
                    <p>Indirizzo: {dettagli.indirizzo} {dettagli.numero_civico}</p>
                    <p>Descrizione:</p>
                    <div style={{width: "70%"}}>
                        {dettagli.descrizione}
                    </div>
                    <br/>
                    <h4><b>Dettagli stanza n. {dettagli.numero_stanza}</b></h4>
                    <p className="mt-3">Posti letto: {dettagli.numero_posti_letto}</p>
                    <p>Dati aggiuntivi:</p>
                    <div>{datiAggiuntivi.length === 0 ? 'Nessun dato aggiuntivo' : datiAggiuntivi}</div>
                    <p><b>Costo giornaliero: {dettagli.prezzo}€</b></p>
                </div>
            );
        }
    }

}

export default DettagliRichiesta;

