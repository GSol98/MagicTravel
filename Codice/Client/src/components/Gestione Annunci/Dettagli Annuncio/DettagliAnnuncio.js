import React from "react";
import Intestazione from "./Intestazione.js";
import Carousel from "./Carousel.js";
import Descrizione from "./Descrizione.js";
import ServiziCasaVacanze from "./ServiziCasaVacanze.js";
import ServiziBeB from "./ServiziB&B.js";
import ServiziAggiuntivi from "./ServiziAggiuntivi.js";
import CostoCasaVacanze from "./CostoCasaVacanze.js";
import CostoBeB from "./CostoB&B.js";
import ModificaNascondi from "./ModificaNascondi.js";

/*
 *          IDEA BASE:
 *  Si parte dalla finestra in cui viene visualizzata la lista degli annunci.
 *  Al click su uno di questi l'utente viene reindirizzato verso la pagina
 *  che consente di visualizzare i dettagli dell'annuncio. Tipo e id_annuncio
 *  vengono inseriti nell'URL al momento del reindirizzamento; qui vengono
 *  recuperati per poter visualizzare i dettagli dell'annuncio selezionato
 *  in precedenza dall'utente.
 */

class DettagliAnnuncio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            annuncio: {},
            stanze: [],
        }
    }

    // All'avvio recupero dalla sessionStorage tutte le informazioni relative agli annunci e le filtro in 
    // modo da ottenere i dettagli dell'annuncio selezionato
    componentDidMount() {
        // Recupero tipo_alloggio e id_alloggio dall'url 
        const url = window.location.hash.substring(1);
        let nome = url.substring(0, 1);
        nome = (nome === "C") ? "Casa Vacanze" : "B&B";
        const tipo = (nome === "Casa Vacanze") ? 0 : 1;
        const id = Number.parseInt(url.substring(1, url.length));

        // Recupero e filtro le informazioni suglia annunci dalla sessionStorage
        let annuncio = JSON.parse(localStorage.getItem("listaAnnunci"))[tipo].filter(annuncio => annuncio.id_annuncio === id); //*
        let stanze = JSON.parse(localStorage.getItem("listaStanze")); //*

        // Memorizzo i dati utili recuperati nello state
        this.setState({
            annuncio: annuncio[0],
            stanze,
            loading: false
        });
    }

    /**
     * Gestisco la modifica dell'annuncio.
     *  Al click del bottone di modifica reindirizzo l'utente alla pagina di modifica dell'annuncio
     *  passando nell'URL tipo e id dell'annuncio da modificare.
     * */
    handleModify = event => {
        const { value } = event.target;
        window.location.href = `/ModificaAnnuncio#${value}`;
    }

    // Gestisco la richiesta di nascondere l'annuncio
    handleHide = event => {
        event.preventDefault();

        // Chiedo conferma riguardo la richiesta
        let res = window.confirm("Sei sicuro di voler nascondere l'annuncio?");

        // Se l'utente conferma nascondo l'annuncio
        if (res) {
            const { value } = event.target;

            // Mando una richiesta di nascondere l'annuncio al server postando anche tipo e id dell'annuncio da nascondere
            fetch("/gestione_annunci/nascondi_annuncio", {
                method: "POST",
                body: JSON.stringify({
                    id: value
                }),
                headers: { "Content-Type": "application/json" }
            })
                .then(res => {     // Caso di successo: reindirizzo l'utente alla pagina della lista dei suoi annunci
                    if (res.status === 200) {
                        alert("Annuncio Nascosto");
                        window.location.href = "/VisualizzaListaAnnunci";
                    }
                    else
                        throw new Error();
                })
                .catch(err => alert(`Impossibile Nascondere`));
        }
    }

    handleShow = event => {
        event.preventDefault();

        // Chiedo conferma riguardo la richiesta
        let res = window.confirm("Sei sicuro di voler rendere visibile l'annuncio?");

        // Se l'utente conferma rendo visibile l'annuncio
        if (res) {
            const { value } = event.target;

            // Mando una richiesta per rendere visibile l'annuncio al server postando anche tipo e id dell'annuncio da mostrare
            fetch("/gestione_annunci/mostra_annuncio", {
                method: "POST",
                body: JSON.stringify({
                    id: value
                }),
                headers: { "Content-Type": "application/json" }
            })
                .then(res => {     // Caso di successo: reindirizzo l'utente alla pagina della lista dei suoi annunci
                    if (res.status === 200) {
                        alert("L'annuncio è Visibile");
                        window.location.href = "/VisualizzaListaAnnunci";
                    }
                    else
                        throw new Error();
                })
                .catch(err => alert(`Impossibile Rendere L'annuncio Visibile`));
        }
    }

    render() {
        // Attendo il caricamento dell'annuncio dal database
        if (this.state.loading || !this.state.annuncio.id_annuncio)
            return <h1 style={{ textAlign: "center", height: "500px", lineHeight: "500px", fontSize: '4vw' }}>Caricamento...</h1>;

        // Se l'annuncio si riferisce ad una Casa Vacanza ne mostro i dettagli
        if (this.state.annuncio.tipo_alloggio === "Casa Vacanze") {
            return (
                <div id="Annuncio" className="container mt-5 rounded shadow-lg impaginazione py-3">
                    <Intestazione
                        state={this.state.annuncio}
                    />

                    <Carousel
                        state={this.state.annuncio}
                    />

                    <Descrizione
                        state={this.state.annuncio}
                    />

                    <ServiziCasaVacanze
                        state={this.state.annuncio}
                    />

                    <ServiziAggiuntivi
                        state={this.state.annuncio}
                    />

                    <CostoCasaVacanze
                        state={this.state.annuncio}
                    />

                    <ModificaNascondi
                        state={this.state.annuncio}
                        modifica={this.handleModify}
                        nascondi={this.handleHide}
                        mostra={this.handleShow}
                    />
                </div>
            );
        }

        // Se l'annuncio si riferisce ad un B&B ne mostro i dettagli
        return (
            <div id="Annuncio" className="container mt-5 rounded shadow-lg impaginazione py-3">

                <Intestazione
                    state={this.state.annuncio}
                />

                <Carousel
                    state={this.state.annuncio}
                />

                <Descrizione
                    state={this.state.annuncio}
                />

                <ServiziBeB
                    state={this.state.annuncio}
                    stanze={this.state.stanze.filter(stanza => stanza.ref_beb === this.state.annuncio.id_annuncio)}
                />

                <ServiziAggiuntivi
                    state={this.state.annuncio}
                />

                <CostoBeB
                    state={this.state.annuncio}
                    stanze={this.state.stanze.filter(stanza => stanza.ref_beb === this.state.annuncio.id_annuncio)}
                />

                <ModificaNascondi
                    state={this.state.annuncio}
                    modifica={this.handleModify}
                    nascondi={this.handleHide}
                    mostra={this.handleShow}
                />
            </div>
        );
    }
}

export default DettagliAnnuncio;
