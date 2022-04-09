import React from "react";
import Ricerca from './Ricerca';
import Filtri from './Filtri';

class FinestraPrincipale extends React.Component {

    constructor() {
        super();
        this.state = {
            loading: true,
            comuni: [],
            extra: false,
            destinazione: "",
            tipoAnnuncio: "",
            prezzo: "",
            dal: "",
            al: "",
            persone: '',
            altro: []
        }
    }

    //======================================
    //Funzione componentDidMount()
    //======================================

    componentDidMount() {

        //Richiedo i comuni al server
        fetch("/javascripts/comuni.json")
            .then(res => res.json())
            .then(data => this.setState({ comuni: data, loading: false }))
            .catch(err => { throw err; });
    }

    //======================================
    //Funzione cerca()
    //======================================

    //Permette la memorizzazione dei filtri
    handleChange = event => {
        const { name, value, checked } = event.target;

        //Se la funzione viene chiamata dalla selezione dei filtri di tipo altro
        //allora li aggiungo all'array altro dello stato se è checked altrimenti lo rimuovo
        if (name === 'altro') {
            if (checked) {
                let altro = this.state.altro;
                altro.push(value);
                this.setState({
                    altro: altro
                });
            }
            else {
                let altro = this.state.altro;
                altro.splice(altro.indexOf(value), 1);
                this.setState({
                    altro: altro
                });
            }
        }

        //Controllo se è il filtro seleziona tutto
        else if (name === 'all') {

            //Prendo tutti gli elementi dei filtri
            let filtri = document.getElementsByClassName('filtriAggiuntiviRicerca');

            if (checked) {

                //Imposta a tutti l'attrubuto checked
                for (let filtro of filtri)
                    filtro.checked = true;

                //Aggiungo tutto allo state
                let arr = [];
                for (let filtro of filtri)
                    arr.push(filtro.value);

                this.setState({ altro: arr });
            }

            //Altrimenti lo tolgo a tutti
            else {
                for (let filtro of filtri)
                    filtro.checked = false;

                //Svuoto lo state
                this.setState({ altro: [] });
            }

        }

        //Viene chiamata dagli altri filtri
        else
            this.setState({ [name]: value });
    }

    //======================================
    //Funzione cerca()
    //======================================

    //Una volta premuto il pulsante cerca verranno salvati i vari filtri nel
    //localStorage e verrà richiamato l'elemento visualizza annunci ricerca
    cerca = event => {

        //Se l'utente ha inserito il check-in o il check-out controllo che abbia inserito pure l'altro
        //e che i valori siano validi
        if (this.controlloDate(1) && this.state.destinazione !== "") {
            event.preventDefault();
            window.localStorage.setItem("Destinazione", this.state.destinazione.toLowerCase());
            window.localStorage.setItem("Tipo", this.state.tipoAnnuncio);
            window.localStorage.setItem("Prezzo", this.state.prezzo);
            window.localStorage.setItem("Dal", this.state.dal);
            window.localStorage.setItem("Al", this.state.al);
            window.localStorage.setItem("Persone", this.state.persone);
            window.localStorage.setItem("Altro", this.state.altro);
            window.location.href = `/VisualizzaAnnunciRicerca`;
        }
    }

    //======================================
    //Funzione controlloDate()
    //======================================

    //Controlla la validità delle date
    controlloDate(val = 0) {

        //Se il controllo è effettuato dalla funzione cerca val=1 allora non avere date inserite è
        //accettabile
        if (this.state.dal === '' && this.state.al === '' && val === 1)
            return true;

        if (this.state.dal === '' && this.state.al === '' && val === 0)
            return false;

        //Controllo se è stata inserita solo la data di check-in
        if (this.state.dal !== '' && this.state.al === '') {
            if (val === 1)
                alert('Inserire una data di check-out valida');
            return false;
        }


        //Controllo se è stata inserita solo la data di check-out
        if (this.state.dal === '' && this.state.al !== '') {
            if (val === 1)
                alert('Inserire una data di check-in valida');
            return false;
        }


        //Controllo che la data di check_in sia successiva alla data odierna
        if (new Date(this.state.dal) < new Date()) {
            if (val === 1)
                alert("La data di check-in non può essere minore o uguale al giorno corrente");
            return false;
        }


        //Controllo che il check-out sia dopo il check-in
        if (new Date(this.state.al) < new Date(this.state.dal)) {
            if (val === 1)
                alert("Il checkout non può avvenire prima del checkIn");
            return false;
        }


        //Se ha superato tutti i controlli e la condizione sussiste allora controllo se le date
        //sono accettabili
        if (Number.parseInt((new Date(this.state.dal)).getFullYear()) > 2000 && Number.parseInt((new Date(this.state.al)).getFullYear()) > 2000)
            return true;

        return false;

    }

    //======================================
    //Funzione extra()
    //======================================

    //Permette di visualizzare i filtri
    extra = () => {
        this.setState({
            extra: !this.state.extra
        });
    }

    //======================================
    //Funzione autocomplete()
    //======================================

    //Stampa i suggerimenti durante la ricerca
    autocomplete = event => {

        //Richiamo la funzione dichiarata dopo
        closeAllLists();
        const { name, value } = event.target;

        //Cerco eventuali corrispondenze
        let corrispondenze = this.state.comuni.filter(comune => comune.nome.toLowerCase().indexOf(value.toLowerCase()) >= 0);

        //Se ho meno di 8 corrispondenze le stampo
        if (corrispondenze.length < 8) {

            //Creo il contenitore dove inserire le corrispondenze
            let a = document.createElement("div");

            //Aggiungo id e classe
            a.setAttribute("id", "listaComuni");
            a.setAttribute("class", "autocomplete-items");

            //Lo inserisco nel document
            event.target.parentNode.appendChild(a);

            //Creo gli elementi contenenti i comuni
            corrispondenze.forEach(comune => {

                //Creo il contenitore
                let b = document.createElement("div");

                //Inserisco un campo testo e un elemento input
                b.innerHTML = `<p>${comune.nome}</p>`
                b.innerHTML += `<input type="hidden" id="${comune.nome}" value="${comune.nome}" />`;

                //Se clicco sulla corrispondenza l'aggiungo immediatamente al campo ricerca
                b.addEventListener("click", () => {
                    this.setState({ destinazione: document.getElementById(`${comune.nome}`).value });
                    a.innerHTML = "";
                })

                //Inserisco l'elemento nel contenitore prima creato
                a.appendChild(b);
            });
        }

        //Elimino tutte le corrispondenze
        function closeAllLists(element) {
            let x = document.getElementsByClassName("autocomplete-items");
            for (var i = 0; i < x.length; i++) {
                if (element !== x[i] && element !== event.target)
                    x[i].parentNode.removeChild(x[i]);
            }
        }

        //Permette di non bloccare l'inserimento di lettere nel form
        this.setState({ [name]: value });
    }

    //======================================
    //Funzione render()
    //======================================

    render() {

        //Controllo che siano arrivati i dati dal backend prima di mostrare la ricerca
        if (this.state.loading)
            return (<h1 style={{ textAlign: "center", lineHeight: "400px" }}>Caricamento...</h1>);

        return (
            <div id='backgroundMain'>
                <div>
                    <Ricerca autocomplete={this.autocomplete}
                        destinazione={this.state.destinazione}
                        cerca={this.cerca}
                        extra={this.extra} />


                    {this.state.extra ? <Filtri handleChange={this.handleChange}
                        state={this.state}
                        controlloDate={this.controlloDate} /> : ''}
                </div>
            </div>

        );
    }
}

export default FinestraPrincipale;
