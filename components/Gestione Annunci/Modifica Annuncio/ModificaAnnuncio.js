import React from "react";
import FinestraModificaCasaVacanze from "./FormModificaCasaVacanze.js";
import FinestraModificaBeB from "./FormModificaB&B.js";
import ControlloServizioAggiuntivo from "../../../functions/ControlloServizioAggiuntivo.js";
import decripta from "../../../functions/decripta.js"; //*
/**
 *  Viene visualizzato lo stesso form del caso della creazione dell'annuncio, ma è gia compilato
 *  con i dati inseriti in fase di creazione dell'annuncio e recuperati dal database
 */

class ModificaAnnuncio extends React.Component {
    constructor() {
        super();
        this.state = {
            loading: true,
            annuncio: {},
            stanze: [],
            serviziAggiuntivi: {},
            immagineCopertina: null,
            immaginiNuove: [],
            immaginiDaEliminare: []
        }
    }

    // All'avvio recupero dalla sessionStorage tutte le informazioni relative agli annunci e le filtro in 
    // modo da ottenere i dettagli dell'annuncio selezionato
    componentDidMount() {
        // Recupero tipo_alloggio e id_alloggio dall'url 
        const url = window.location.hash.substring(1);
        let nome = url.substring(0, 1);
        nome = (nome === "B") ? "B&B" : "Casa Vacanze";
        const tipo = (nome === "Casa Vacanze") ? 0 : 1;
        const id = Number.parseInt(url.substring(1, url.length));

        // Recupero e filtro le informazioni suglia annunci dalla sessionStorage
        let annuncio = JSON.parse(localStorage.getItem("listaAnnunci"))[tipo].find(annuncio => annuncio.id_annuncio === id); //*
        let stanze = JSON.parse(localStorage.getItem("listaStanze")).filter(stanza => stanza.ref_beb === id); //*
        let serv = {};
        for (let servizio in annuncio) {
            if (ControlloServizioAggiuntivo(servizio)) {
                if (annuncio[servizio] === 0)
                    serv[servizio] = false;
                else
                    serv[servizio] = true;
            }
        }

        // Memorizzo i dati utili recuperati nello state
        annuncio.camere = [];
        annuncio.postiLetto = [];
        annuncio.prezzo = [];

        this.setState({
            annuncio,
            stanze,
            serviziAggiuntivi: serv,
            loading: false
        });
    }

    // Gestisco la modifica dello state
    handleChange = event => {
        const { type, name, value, checked } = event.target;
        type === "checkbox" ? this.setState(prevState => {
            return {
                annuncio: {
                    ...prevState.annuncio,
                    [name]: checked
                }
            }
        })
            :
            this.setState(prevState => {
                return {
                    annuncio: {
                        ...prevState.annuncio,
                        [name]: value
                    }
                }
            });
    }

    // Gestisco la moficia delle stanze nel caso si tratti di un B&B
    handleChangeStanze = event => {
        const { name, value } = event.target;
        let nome = name.substring(0, 1);
        let id = name.substring(1, name.length);

        if (nome === "C") {
            let camere = this.state.annuncio.camere;
            camere[id] = value;
            this.setState(prevState => {
                return {
                    annuncio: {
                        ...prevState.annuncio,
                        camere
                    }
                }
            });
        }
        else if (nome === "L") {
            let letti = this.state.annuncio.postiLetto;
            letti[id] = value;
            this.setState(prevState => {
                return {
                    annuncio: {
                        ...prevState.annuncio,
                        postiLetto: letti
                    }
                }
            });
        }
        else if (nome === "P") {
            let prezzo = this.state.annuncio.prezzo;
            prezzo[id] = value;
            this.setState(prevState => {
                return {
                    annuncio: {
                        ...prevState.annuncio,
                        prezzo
                    }
                }
            });
        }
    }

    // Gestisco la modifica dei servizi aggiuntivi
    handleChangeServiziAggiuntivi = event => {
        const { name, checked } = event.target;

        this.setState(prevState => {
            return {
                serviziAggiuntivi: {
                    ...prevState.serviziAggiuntivi,
                    [name]: checked
                }
            }
        });
    }

    // Gestisco il caricamento dele immagini
    imageFetch = event => {
        // Al caricamento di una imamgine ne viene mostrata una preview
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
                    image.className = "mt-4 mx-2 col-12";

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
            this.state.immaginiNuove.forEach(img => {
                formData.append("immagine", img);
            })
            this.setState({ immaginiNuove: formData });
        }
    }

    imageDelete = event => {
        const { name, checked } = event.target;
        let imgs = this.state.immaginiDaEliminare;

        if (checked)
            imgs.push(name);
        else
            imgs.splice(imgs.indexOf(name), 1);

        this.setState({ immaginiDaEliminare: imgs });
    }

    // Gestisco la consegna del form con il post del nuovo annuncio modificato
    handleSubmit = event => {
        event.preventDefault();
        let url = window.location.hash.substring(1);
        let nome = url.substring(0, 1);
        let id = url.substring(1, url.length);
        let idAccount = decripta(window.sessionStorage.getItem("id_account"), window.sessionStorage.getItem("email")) //*
        fetch("/gestione_annunci/modifica_annuncio", {
            method: "POST",
            body: JSON.stringify({
                id_proprietario: idAccount, //*
                state: this.state.annuncio,
                serviziAggiuntivi: this.state.serviziAggiuntivi,
                stanze: this.state.stanze,
                immaginiDaEliminare: this.state.immaginiDaEliminare,
                nome: nome,
                id: id
            }),
            headers: { "Content-Type": "application/json" }
        })
            .then(res => {
                if (res.status === 500)      // Caso di errore scatenato dalla presenza di prenotazioni riferite all'annuncio
                    throw new Error();
                else {
                    // Se viene inserita l'immagine di copertina ne richiedo la modifica
                    if (this.state.immagineCopertina) {
                        fetch("/gestione_annunci/modifica_immagine_copertina", {
                            method: "POST",
                            body: this.state.immagineCopertina
                        })
                            .then(res => {
                                if (res.status !== 200)
                                    throw new Error();
                            })
                    }

                    // Se vengono inserite nuove immagini ne richiedo l'inserimento
                    if (this.state.immaginiNuove.length !== 0) {
                        // Inserisco tutte le altre immagini
                        fetch("/gestione_annunci/modifica_immagini", {
                            method: "POST",
                            body: this.state.immaginiNuove
                        })
                            .then(res => {
                                if (res.status !== 200)
                                    throw new Error();
                            });
                    }

                    alert("Annuncio Correttamente Modificato");
                    window.location.href = "/VisualizzaListaAnnunci";
                }
            })
            .catch(err => alert(`Impossibile Modificare`));
    }

    render() {
        // Attesa del caricamento dei dati dell'annuncio dal database 
        if (this.state.loading || Object.keys(this.state.annuncio).length === 0)
            return <h1 style={{ textAlign: "center", height: "400px", lineHeight: "400px" }}>Caricamento...</h1>;

        // Se l'annuncio si riferisce ad una casa vacanze viene renderizzato il form di modifica delle case vacanze
        if (this.state.annuncio.tipo_alloggio === "Casa Vacanze") {
            return (
                <div className="container mt-5 py-5 rounded shadow-lg impaginazione" id="ModificaAnnuncio">
                    <h1 style={{ textAlign: "center" }} className="pb-5">Modifica L'Annuncio</h1>
                    <FinestraModificaCasaVacanze
                        state={this.state.annuncio}
                        serviziAggiuntivi={this.state.serviziAggiuntivi}
                        handleChange={this.handleChange}
                        handleChangeServiziAggiuntivi={this.handleChangeServiziAggiuntivi}
                        imageFetch={this.imageFetch}
                        imageDelete={this.imageDelete}
                        handleSubmit={this.handleSubmit}
                    />
                </div>
            );
        }
        // Se l'annuncio si riferisce ad un B&B viene renderizzato il form di modifica dei B&B
        else {
            return (
                <div className="container mt-5 py-5 rounded shadow-lg impaginazione" id="ModificaAnnuncio">
                    <h1 style={{ textAlign: "center" }} className="pb-5">Modifica L'Annuncio</h1>
                    <FinestraModificaBeB
                        state={this.state.annuncio}
                        stanze={this.state.stanze}
                        serviziAggiuntivi={this.state.serviziAggiuntivi}
                        handleChange={this.handleChange}
                        handleChangeServiziAggiuntivi={this.handleChangeServiziAggiuntivi}
                        handleChangeStanze={this.handleChangeStanze}
                        imageFetch={this.imageFetch}
                        imageDelete={this.imageDelete}
                        handleSubmit={this.handleSubmit}
                    />
                </div>
            );
        }
    }
}

export default ModificaAnnuncio;
