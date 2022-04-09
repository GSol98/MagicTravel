import React from "react";

class GestisciPDF extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            inizio: true,
            input: false,
            statoCaricamento: '',
            documenti: '',
            check: [],
            check_on: false,
            aggiungi: true,
            id: this.props.id_prenotazione
        }
    }

    //==============================
    //Funzione componentDidMount()
    //==============================

    //Stampo la lista dei pdf caricati
    componentDidMount() {

        //Controlliamo se siamo in una stanza di b&b e troiviamo il nome che avrà la cartella
        if (this.props.tipo === 'B') {
            fetch("/gestione_pdf/id_stanze", {
                method: "POST",
                body: JSON.stringify({
                    id: this.state.id,
                }),
                headers: { "Content-Type": "application/json" }
            })
                .then(res => res.json())
                .then(data => {
                    this.stampaLista('primoB', data.id);
                })
                .catch(err => { console.log(err) })
        }
        else
            this.stampaLista('primoC');
    }

    //==============================
    //Funzione stampaLista()
    //==============================

    //Stampa la lista dei pdf caricati
    stampaLista = (situazione, id = null) => {
        fetch("/gestione_pdf/lista", {
            method: "POST",
            body: JSON.stringify({
                id: (id === null) ? this.state.id : id,
                tipo: this.props.tipo
            }),
            headers: { "Content-Type": "application/json" }
        })
            .then(res => res.json())
            .then(data => {

                /*this.setState({
                    documenti: documenti
                });*/

                switch (situazione) {
                    case 'primoC':
                        this.setState({
                            documenti: data
                        });
                        break;

                    case 'primoB':
                        this.setState({
                            documenti: data,
                            id: id
                        });
                        break;

                    case 'carica':
                        this.setState({
                            documenti: data,
                            input: false,
                            statoCaricamento: <div>Caricamento avvenuto con successo</div>
                        });
                        break;

                    case 'elimina':
                        this.setState({
                            documenti: data,
                            statoCaricamento: <div>Eliminazione avvenuta con successo</div>,
                            check: [],
                            check_on: false,
                            aggiungi: true
                        });
                        break;
                    default:
                        break;
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    //==============================
    //Funzione check()
    //==============================

    //Seleziona o deseleziona i pdf da eliminare
    check = (event) => {
        const { value, checked } = event.target;

        if (checked) {
            let check = this.state.check;
            check.push(value);
            this.setState({
                check: check
            });
        }
        else {
            let check = this.state.check;
            let index = check.indexOf(value);
            check.splice(index, 1)
            this.setState({
                check: check
            });
        }
    }

    //==============================
    //Funzione cambiaInizio()
    //==============================

    //Serve per visualizzare la finestra per la gestione dei pdf
    cambiaInizio = () => {
        this.setState({
            inizio: false,
        });
    }

    //==============================
    //Funzione aggiungi()
    //==============================

    //Fa apparire l'input per inserire i file
    aggiungi = () => {
        this.setState({
            input: !this.state.input,
            statoCaricamento: ''
        });
    }

    //==============================
    //Funzione carica()
    //==============================

    //Permette di carica un pdf nel server
    carica = (event) => {

        //Controllo se esiste la cartella dove caricare i file.
        //Se non esiste viene creata
        fetch("/gestione_pdf/controllo_cartella", {
            method: "POST",
            body: JSON.stringify({
                id: this.state.id,
                tipo: this.props.tipo
            }),
            headers: { "Content-Type": "application/json" }
        })
            .catch((err) => {
                console.log(err)
            })

        //Prendo i file selezionati
        const { files } = event.target;
        let formData = new FormData();
        Array.from(files).forEach(pdf => {
            formData.append(`${this.props.tipo}${this.state.id}`, pdf);
        });

        //Invio i file al db
        fetch("/gestione_pdf/carica", {
            method: "POST",
            body: formData
        })
            .then(res => {
                if (res.status === 200)
                    this.stampaLista('carica');
                else
                    throw new Error();
            })
            .catch(err => {
                console.log(err);
            })
    }

    //==============================
    //Funzione elimina()
    //==============================

    //Elimina i pdf selezionati
    elimina = () => {

        //La prima volta che clicco su elimina appaiono le check_box e la scritta
        if (this.state.check_on) {

            //Controllo se l'utente ha selezionato degli elementi da eliminare
            if (this.state.check.length !== 0) {

                fetch("/gestione_pdf/elimina", {
                    method: "POST",
                    body: JSON.stringify({
                        id: this.state.id,
                        nomi: this.state.check,
                        tipo: this.props.tipo
                    }),
                    headers: { "Content-Type": "application/json" }
                })
                    .then(res => {
                        if (res.status === 200)
                            this.stampaLista('elimina');
                        else
                            throw new Error();
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
            else
                this.setState({
                    statoCaricamento: <div>Selezionare pdf da eliminare</div>
                });
        }
        else
            this.setState({
                check_on: true,
                aggiungi: false,
                input: false,
                statoCaricamento: ''
            });
    }

    //==============================
    //Funzione annulla()
    //==============================

    //Permette di annullare l'eliminazione di un file
    annulla = () => {
        this.setState({
            check_on: false,
            aggiungi: true,
            statoCaricamento: ''
        });
    }
    render() {

        //Stampo il bottone per visualizzare i vari pdf
        if (this.state.inizio) return <button onClick={this.cambiaInizio} className="btn btn-secondary btn-sm mr-2">Visualizza PDF</button>

        //Creo l'input per inserire i dile solo se l'utente clicca su aggiungi
        let input = (this.state.input) ? <input type="file" onChange={this.carica} accept="application/pdf" multiple className="my-3" /> : '';

        //Creo l'elenco dei documenti
        let documenti = [];
        if (this.state.documenti.length !== 0) {
            for (let [index, documento] of this.state.documenti.entries())
                documenti.push(<div className="ml-1" key={index}>
                    {(this.state.check_on) ? <input onChange={this.check} className="mr-2" type="checkbox" name={documento} value={documento}></input> : ''}
                    <a target="_blank" href={`https://${window.location.hostname}:9000/pdf/${this.props.tipo}${this.state.id}/${documento}`} rel="noopener noreferrer">{documento}</a>
                </div>
                );
        }
        return (
            <div>
                <label className="lead mb-3">Documenti caricati</label>
                <div>
                    {(!this.state.check_on) ? '' : <div><p style={{ textDecoration: "underline solid black" }}>Seleziona i file che vuoi rimuovere e poi premi elimina.</p></div>}
                    {(this.state.documenti.length === 0) ? 'Nessun documento caricato' : documenti}
                </div>
                <br />
                <div>
                    {(this.state.aggiungi) ? <button onClick={this.aggiungi} className="btn btn-secondary btn-sm my-2 mr-3" type="button">Aggiungi</button> : ''}
                    {(this.state.documenti.length === 0) ? '' : <button onClick={this.elimina} type="button" className="btn btn-secondary btn-sm my-2 mr-3">Elimina</button>}
                    {(this.state.check_on) ? <button onClick={this.annulla} type="button" className="btn btn-secondary btn-sm my-2 mr-3">Annulla</button> : ''}
                </div>
                <div>
                    {input}
                </div>
                <div className="my-3">
                    {this.state.statoCaricamento}
                </div>
            </div>
        );
    }
}

export default GestisciPDF;