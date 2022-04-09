import React from "react";
import TitoloAnnuncio from "./TitoloAnnuncio.js";
import Locazione from "./Locazione.js";
import Descrizione from "./Descrizione.js";
import Servizi from "./ServiziB&B.js";
import ServiziAggiuntivi from "./ServiziAggiuntivi.js";
import ImmagineCopertina from "./ImmagineCopertina.js";
import Immagini from "./Immagini.js";
import TassaDiSoggiorno from "./TassaDiSoggiorno.js";
import decripta from "../../../functions/decripta.js"; //*
/**
 * L'idea del form è quella di mantenere costantemente tutti i dati inseriti nello state in modo che,
 * al submit, i dati siano già stati raccolti e sarà possibile inviarli postando lo state
 */

class FormContainerCasaVacanza extends React.Component {
    constructor() {
        super();
        this.state = {
            tipo_alloggio: "B&B",
            titolo: "",
            regione: "",
            provincia: "",
            comune: "",
            indirizzo: "",
            numero_civico: "",
            descrizione: "",
            camere: [],
            postiLetto: [],
            prezzo: [],
            wifi: false,
            televisore: false,
            ascensore: false,
            parcheggio: false,
            animali: false,
            fumatori: false,
            ariaCondizionata: false,
            riscaldamenti: false,
            trasporti: false,
            microonde: false,
            lavastoviglie: false,
            frigorifero: false,
            forno: false,
            lavabiancheria: false,
            asciugatrice: false,
            phon: false,
            ferroDaStiro: false,
            telecamere: false,
            estintore: false,
            allarmeFurto: false,
            allarmeIncendio: false,
            immagineCopertina: null,
            immagini: [],
            tassa_soggiorno: "",
        }
    }

    // Gestisco la modifica dello state per ogni dato inserito
    handleChange = event => {
        const { type, name, value, checked } = event.target;
        type === "checkbox" ? this.setState({ [name]: checked }) : this.setState({ [name]: value });
    }


    handleChangeServizi = event => {
        const { name, value } = event.target;
        let nome = name.substring(0, 1);
        let id = name.substring(1, name.length);

        if (nome === "C") {
            let camere = this.state.camere;
            camere[id] = value;
            this.setState({ camere });
        }
        else if (nome === "L") {
            let letti = this.state.postiLetto;
            letti[id] = value;
            this.setState({ postiLetto: letti });
        }
        else if (nome === "P") {
            let prezzo = this.state.prezzo;
            prezzo[id] = value;
            this.setState({ prezzo });
        }
    }

    // Gestisco il caricamento delle immagini
    imageFetch = event => {
        // Ogni volta che viene cariacata un'immagine ne viene mostrata una preview
        const preview = document.getElementById('preview');
        const { name, files } = event.target;
        function leggiImmagine(file) {
            if (/\.(jpe?g|png)$/i.test(file.name)) {
                const reader = new FileReader();

                reader.addEventListener("load", function () {
                    let image = new Image();
                    image.style.height = "200px";
                    image.style.maxWidth = "250px";
                    image.title = file.name;
                    image.src = this.result;
                    image.alt = file.name;
                    image.className = "mt-4  mx-2 col-12";

                    // Se viene inserita una nuova i mmagine di copertina rimuovo quella vecchia dalla preview
                    if (name === "immagineCopertina") {
                        let vecchiaCopertina = document.getElementById("copertina");
                        if (vecchiaCopertina)
                            vecchiaCopertina.parentElement.removeChild(vecchiaCopertina);
                        image.id = "copertina";
                    }

                    preview.appendChild(image);
                }, false);
                reader.readAsDataURL(file);
            }
        }
        if (files)
            [].forEach.call(files, leggiImmagine);

        // Le immagini vengono caricate come formData nello state
        const formData = new FormData();

        Array.from(files).forEach(img => {
            formData.append("immagine", img);
        });

        if (name === "immagineCopertina")
            this.setState({ immagineCopertina: formData });

        else {
            this.state.immagini.forEach(img => {
                formData.append("immagine", img);
            })
            this.setState({ immagini: formData });
        }
    }


    /**
 *  Gestisco la consegna del form che consiste nel postare lo state al server.
 *  Implemento una catena di post in modo da creare inzialmente l'annuncio; se la creazione va a buon fine
 *  posto l'immagine di copertina in modo da creare, nel server, la cartella delle immagini relative 
 *  all'annuncio e memorizzarvi all'interno l'immafine di copertina; infine, se anche questa operazione
 *  non ha presentato errori, posto tutte le altre immagini.
 *  */
    handleSubmit = event => {
        event.preventDefault();

        //Disabilito il bottone di creazione annuncio per evitare che con il click ripetuto vengano creati più annunci uguali
        document.getElementById('bottoneCreaAnnuncioBeb').disabled = true;

        let id = decripta(window.sessionStorage.getItem("id_account"), window.sessionStorage.getItem("email"))
        // Inserisco l'annuncio
        fetch("/inserimento_annunci/crea_annuncio_beb", {
            method: "POST",
            body: JSON.stringify({
                id_proprietario: id,
                state: this.state
            }),
            headers: { "Content-Type": "application/json" }
        })
        .then(res => {
            if (res.status === 200) {
                // Inserisco l'immagine di copertina
                fetch("inserimento_annunci/inserimento_immagine_copertina", {
                    method: "POST",
                    body: this.state.immagineCopertina
                })
                    .then(res => {
                        if (res.status === 200) {
                            // Inserisco tutte le altre immagini
                            fetch("inserimento_annunci/inserimento_immagini", {
                                method: "POST",
                                body: this.state.immagini
                            })
                                .then(res => {
                                    if (res.status === 200) {
                                        alert("Annuncio Correttamente Creato");
                                        window.location.href = "/VisualizzaListaAnnunci";
                                    }
                                    else
                                        throw new Error();
                                });
                        }
                        else
                            throw new Error();
                    });
            }
            else
                throw new Error();
        })
        .catch(err => {

            //In caso di errore abilito il bottone di creazione annuncio per permettere all'utente di poterlo creare
            document.getElementById('bottoneCreaAnnuncioBeb').disabled = false;
            alert("Impossibile Creare L'annuncio");
        });
    }

    render() {
        return (
            <form className="container was-validated" id="Annuncio" onSubmit={this.handleSubmit}>
                <label className="lead" style={{ fontSize: "1.3em" }}>Tipo Alloggio: <strong>{this.state.tipo_alloggio}</strong></label>

                <TitoloAnnuncio
                    state={this.state}
                    handleChange={this.handleChange}
                />

                <Locazione
                    state={this.state}
                    handleChange={this.handleChange}
                />

                <Descrizione
                    state={this.state}
                    handleChange={this.handleChange}
                />

                <Servizi
                    state={this.state}
                    handleChange={this.handleChangeServizi}
                />

                <ServiziAggiuntivi
                    state={this.state}
                    handleChange={this.handleChange}
                />

                <div className="mt-5">
                    <label className="lead">IMMAGINI</label>
                    <div className="row">
                        <ImmagineCopertina
                            state={this.state}
                            imageFetch={this.imageFetch}
                        />
                        <Immagini
                            state={this.state}
                            imageFetch={this.imageFetch}
                        />
                        <div id="preview"></div>
                    </div>
                </div>

                <TassaDiSoggiorno
                    state={this.state}
                    handleChange={this.handleChange}
                />
                <button style={{ float: "right" }} className="btn btn-secondary my-5" id='bottoneCreaAnnuncioBeb'>Crea Annuncio</button>
                <br /><br /><br />
            </form>
        )
    }
}

export default FormContainerCasaVacanza;
