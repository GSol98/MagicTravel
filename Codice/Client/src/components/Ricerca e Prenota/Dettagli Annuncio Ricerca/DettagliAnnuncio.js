import React from "react";
import Intestazione from "../../Gestione Annunci/Dettagli Annuncio/Intestazione.js";
import Carousel from "../../Gestione Annunci/Dettagli Annuncio/Carousel.js";
import Descrizione from "../../Gestione Annunci/Dettagli Annuncio/Descrizione.js";
import ServiziCasaVacanze from "../../Gestione Annunci/Dettagli Annuncio/ServiziCasaVacanze.js";
import ServiziBeB from "../../Gestione Annunci/Dettagli Annuncio/ServiziB&B.js";
import ServiziAggiuntivi from "../../Gestione Annunci/Dettagli Annuncio/ServiziAggiuntivi.js";
import CostoCasaVacanze from "../../Gestione Annunci/Dettagli Annuncio/CostoCasaVacanze.js";
import CostoBeB from "../../Gestione Annunci/Dettagli Annuncio/CostoB&B.js";

class DettagliAnnuncioRicerca extends React.Component {
    constructor() {
        super();
        this.state = {
            loading: true,
            annuncio: {},
            listaStanze: [],
        }
    }

    //============================
    //Funzione handlePrenota()
    //============================

    //Permette di iniziare la prenotazione
    handlePrenota = event => {
        event.preventDefault();
        //Se l'utente è già autenticato permetto di farlo prenotare
        if(sessionStorage.getItem("id_account") && sessionStorage.getItem("email")) {
            window.location.href = `/RichiestaPrenotazione#${this.state.annuncio.id_annuncio}_${this.state.annuncio.tipo_alloggio}`
        }
        else {
            let campi = window.location.href.split("/")
            window.location.href = `/Login#${campi[campi.length - 1]}`
        }
    }

    //============================
    //Funzione componentDidMount()
    //============================

    componentDidMount() {

        //Acquisisco alcune informazioni dall'url
        let url = window.location.hash.substring(1);
        let nome = url[0];
        nome = (nome === "C") ? "Casa Vacanze" : "B&B";
        let id = url.substring(1, url.length);
        let annuncio = {};

        //Richiedo i dettagli
        fetch("/trova_annunci/recupera_annunci", {
            method: "POST",
            body: JSON.stringify({ nome, id }),
            headers: { "Content-Type": "application/json" }
        })
        .then(res => res.json())
        .then(data => {
            annuncio = data

            //Se è una casa vacanza carico l'annuncio
            if (nome === 'Casa Vacanze')
                this.setState({
                    loading: false,
                    annuncio: annuncio
                });

            //Se un b&b richiedo le stanze
            else {
                fetch("/trova_annunci/recupero_stanze_beb", {
                    method: "POST",
                    body: JSON.stringify({ id }),
                    headers: { "Content-Type": "application/json" }
                })
                .then(res => res.json())
                .then(data => this.setState({
                    listaStanze: data,
                    annuncio: annuncio,
                    loading: false,
                }))
                .catch(err => { throw err; });
            }
        })
        .catch(error => console.log(error));
    }

    //============================
    //Funzione render()
    //============================

    render() {

        //Fin quando non ricevo tutti file necessai non mostro la lista
        if (this.state.loading || !this.state.annuncio.id_annuncio)
            return <h1 style={{ textAlign: "center", height: "500px", lineHeight: "500px", fontSize: '4vw' }}>Caricamento...</h1>;

        //Stampo i vari campi
        return (
            <div id="Annuncio" className="container mt-5 rounded shadow-lg impagina py-3">
                <Intestazione state={this.state.annuncio} />
                <Carousel state={this.state.annuncio} />
                <Descrizione state={this.state.annuncio} />
                
                {this.state.annuncio.tipo_alloggio === "Casa Vacanze" ?
                        <ServiziCasaVacanze state={this.state.annuncio} /> :
                        <ServiziBeB state={this.state.annuncio} stanze={this.state.listaStanze} />}
                <ServiziAggiuntivi state={this.state.annuncio} />

                {this.state.annuncio.tipo_alloggio === "Casa Vacanze" ?
                        <CostoCasaVacanze state={this.state.annuncio} /> :
                        <CostoBeB state={this.state.annuncio} stanze={this.state.listaStanze} />}

                <button className="btn btn-secondary btn-block my-5" onClick={this.handlePrenota}>Prenota</button>
            </div>
        );
    }
}

export default DettagliAnnuncioRicerca;
