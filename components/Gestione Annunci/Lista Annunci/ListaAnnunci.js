import React from "react";
import AnnuncioCasaVacanze from "./AnnuncioCasaVacanze.js";
import AnnuncioBeB from "./AnnuncioB&B.js";
import BarraNavigazione from "../../../common/BarraNavigazione.js";
import decripta from "../../../functions/decripta.js";
// Nella pagina viene renderizzata la lista di annunci creati dall'utente che ha effettuato il login.

class ListaAnnunci extends React.Component {
    constructor() {
        super();
        this.state = {
            loading: true,
            listaAnnunci: [],
            listaStanze: [],
            pagina: 1
        };
    }

    // All'avvio recupero i dati di tutti gli annunci dell'utente e li memorizzo in sessionStorage e nello state
    componentDidMount() {
        let id = decripta(window.sessionStorage.getItem("id_account"), window.sessionStorage.getItem("email"))
        // Recupero i dettagli degli annunci
        fetch("/recupero_annunci/recupera_annunci", {
            method: "POST",
            body: JSON.stringify({ id_proprietario: id }),
            headers: { "Content-Type": "application/json" }
        })
            .then(res => res.json())
            .then(data => {

                // Memorizzo gli annunci in localStorage
                window.localStorage.setItem("listaAnnunci", JSON.stringify(data));

                //Creo un unico array con tutti gli annunci
                data = data[0].concat(data[1]);

                //Ordino gli annunci secondo la data di creazione
                data.sort((a, b) => {
                    return new Date(b.data_creazione) - new Date(a.data_creazione);
                });

                // Recupero i dettagli delle stanze dei B&B
                fetch("/recupero_annunci/recupera_stanze_beb", {
                    method: "POST",
                    body: JSON.stringify({ id_proprietario: id }),
                    headers: { "Content-Type": "application/json" }
                })
                    .then(res => res.json())
                    .then(data1 => {

                        // Memorizzo le stanze in localStorage
                        window.localStorage.setItem("listaStanze", JSON.stringify(data1));

                        this.setState({
                            listaStanze: data1,
                            loading: false,
                            listaAnnunci: data
                        })
                    })
                    .catch(err => { throw err; });
            })
            .catch(err => { throw err; });
    }

    //==============================================
    //Funzione cambiaPagina()
    //==============================================

    //Viene richiamata quando clicchiamo un bottone di una pagina diversa
    cambiaPagina = event => {
        this.setState({
            pagina: Number.parseInt(event.target.value),
        });
    }

    render() {

        // Attesa del caricamento dei dati dal database
        if (this.state.loading)
            return (<h1 style={{ textAlign: "center", height: "500px", lineHeight: "500px", fontSize: '4vw' }}>Caricamento...</h1>);

        // Gestisco il caso in cui l'utente non abbia fatto annunci
        if (this.state.listaAnnunci.length === 0)
            return (<h1 style={{ textAlign: "center", height: "500px", lineHeight: "500px", fontSize: '4vw' }}>Non hai ancora creato annunci</h1>);

        //Inizializzo tutte le variabili per gestire le pagine. Procedura necessaria se presenti troppi annunci
        let stampa = [];
        let pagina = this.state.pagina;
        let annunciPerPagina = 10;

        //Inserisco in un array i soli annunci da stampare
        for (let i = (pagina - 1) * annunciPerPagina; i < (Math.min(pagina * annunciPerPagina, this.state.listaAnnunci.length)); i++) {
            stampa.push(this.state.listaAnnunci[i].tipo_alloggio === "Casa Vacanze" ?
                <AnnuncioCasaVacanze
                    key={`C${this.state.listaAnnunci[i].id_annuncio}`}
                    annuncio={this.state.listaAnnunci[i]}
                /> :
                <AnnuncioBeB
                    key={`B${this.state.listaAnnunci[i].id_annuncio}`}
                    annuncio={this.state.listaAnnunci[i]}
                    stanze={this.state.listaStanze.filter(stanza => stanza.ref_beb === this.state.listaAnnunci[i].id_annuncio)}
                />);
        }

        return (
            <div>
                <div className='container'>
                    <h1 style={{ fontSize: "3em", textAlign: "center" }} className="my-5">I Tuoi Annunci</h1>
                    <h3>Annunci trovati: {this.state.listaAnnunci.length}</h3>
                </div>

                <div className='container'>
                    {stampa}
                </div>

                <div className='container'>
                    <BarraNavigazione
                        numero_pagine={Math.ceil(this.state.listaAnnunci.length / annunciPerPagina)}
                        pagina_attuale={this.state.pagina}
                        cambia_pagina={this.cambiaPagina}
                    />
                </div>
            </div>
        );
    }
}

export default ListaAnnunci;
