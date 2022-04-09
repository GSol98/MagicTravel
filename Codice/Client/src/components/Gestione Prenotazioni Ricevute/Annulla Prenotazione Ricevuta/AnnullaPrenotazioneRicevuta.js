import React from "react";

class AnnullaPrenotazioneRicevuta extends React.Component {

    render() {
        if(this.props.stampaModulo) {
            return(
                <div className="container d-flex justify-content-center" >
                    <form>
                        <h3 className="d-flex justify-content-center mt-5">Motivo annullamento</h3>
                        <label className="my-3" htmlFor="messaggio">Ti preghiamo di inserire la causa dell'annullamento della prenotazione.</label>
                        <textarea placeholder="(facoltativo)" onChange={this.props.aggiornaMotivoAnnullamento} name="messaggio" id="annullaPrenotazioneRicevutaTextarea" rows="10"></textarea>
                        <button id="annullaPrenotazioneRicevutaBottoneAnnulla" type="button" className=" mt-2 btn btn-secondary" onClick={this.props.inviaEmailAnnullamento}>Annulla prenotazione</button>
                    </form>
                </div>
            )    
        }
        else {
            return(
                <button id="annullaPrenotazioneRicevutaBottoneAnnulla" type="button" className="btn btn-secondary" onClick={this.props.cambiaStatoStampaModulo}>Annulla prenotazione</button>
            );
        }
    }
}

export default AnnullaPrenotazioneRicevuta;