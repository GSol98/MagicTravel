import React from 'react';

class Calendario extends React.Component {

    constructor(props) {
        super(props);

        let data = new Date();
        this.state = {
            mese: data.getMonth(),
            anno: data.getFullYear(),
            giorniNeri: [],
            chiuso: true,
        }
    }

    //==============================================
    //Funzione genera()
    //==============================================

    //Permette la formazione delle carie righe della tabella
    genera = (riga, giornoSettimana) => {

        //Prendo il primo giorno del mese che devo stampare
        let giornoUnoDelMese = new Date(this.state.anno, this.state.mese, 1);

        //Sistemo il fatto che getDay() restituisca 0 se il giorno è di domenica e salvo il valore in differenza
        //Tale variabile viene utilizzata per stabilire quando iniziare a stampare i numeri
        //nella tabella
        let differenza = (giornoUnoDelMese.getDay() - 1 < 0) ? 7 : giornoUnoDelMese.getDay();

        //Creo il giorno da stampare per eseguire i vari controlli
        let giorno = new Date(this.state.anno, this.state.mese, riga * 7 + giornoSettimana - differenza + 1);

        //Se non è la prima riga e devo stampare il lunedì che sarà un giorno vuoto
        //ritorno stop in modo da non stampare una riga vuota
        if (riga !== 0 && giornoSettimana === 1 && riga * 7 + giornoSettimana - differenza + 1 !== giorno.getDate()) return 'stop';

        //Controllo se il giorno da stampare è un giorno occupato o no e
        //ritorno un elemento td contenente il numero del giorno
        if (this.state.giorniNeri.includes(riga * 7 + giornoSettimana - differenza + 1) === false)
            return <td style={{ padding: "3px" }}>{((riga * 7 + giornoSettimana - differenza < 0) || (riga * 7 + giornoSettimana - differenza + 1 !== giorno.getDate())) ? '' : riga * 7 + giornoSettimana - differenza + 1}</td>
        else
            return <td style={{ padding: "3px" }} className="dataCalendarioBlack">{((riga * 7 + giornoSettimana - differenza < 0) || (riga * 7 + giornoSettimana - differenza + 1 !== giorno.getDate())) ? '' : riga * 7 + giornoSettimana - differenza + 1}</td>
    }

    //==============================================
    //Funzione avanti()
    //==============================================

    //Permette di visualizzare il mese succesivo
    avanti = () => {
        let giorniNeri = this.giorniOccupati(1);
        if (this.state.mese < 11) {
            this.setState({
                mese: this.state.mese + 1,
                giorniNeri: giorniNeri
            });
        }
        else {
            this.setState({
                anno: this.state.anno + 1,
                mese: 0,
                giorniNeri: giorniNeri
            });
        }
    }

    //==============================================
    //Funzione indietro()
    //==============================================

    //Permette di visualizzare il mese precedente
    indietro = () => {
        let giorniNeri = this.giorniOccupati(-1);
        if (this.state.mese > 0) {
            this.setState({
                mese: this.state.mese - 1,
                giorniNeri: giorniNeri
            });
        }
        else {
            this.setState({
                anno: this.state.anno - 1,
                mese: 11,
                giorniNeri: giorniNeri
            });
        }
    }

    //==============================================
    //Funzione inizio()
    //==============================================

    //Permette di visualizzare o di chiudere il calendario
    visualizza = () => {
        let giorniNeri = [];
        if (this.state.chiuso)
            giorniNeri = this.giorniOccupati(0);

        this.setState({
            giorniNeri: giorniNeri,
            chiuso: !this.state.chiuso
        });
    }


    //==============================================
    //Funzione giorni_tra()
    //==============================================

    //Calcola la differenza tra due date
    giorni_tra = (date1, date2) => {
        var ONE_DAY = 1000 * 60 * 60 * 24;
        var date1_ms = date1.getTime();
        var date2_ms = date2.getTime();
        var difference_ms = date1_ms - date2_ms;
        return Math.round(difference_ms / ONE_DAY);
    }

    //==============================================
    //Funzione giorniOccupati()
    //==============================================

    //Permette di calcolare i giorni in cui l'alloggio è occupato
    giorniOccupati = (val) => {
        let giorniOccupati = [];
        let mese = ((this.state.mese + val) % 12 < 0) ? 11 : (this.state.mese + val) % 12;
        let anno = (this.state.mese + val > 11 || this.state.mese + val < 0) ? this.state.anno + val : this.state.anno;
        for (let prenotazione of this.props.listaPrenotazioni) {

            //Il primo filtra le prenotazioni con solo la data di
            //check_in nel mese corrente
            if (
                this.giorni_tra(
                    new Date(prenotazione.check_in),
                    new Date((mese + 1 > 11) ? anno + 1 : anno, (mese + 1 > 11) ? 0 : mese + 1, 1)
                ) < 0 &&
                this.giorni_tra(
                    new Date(prenotazione.check_in),
                    new Date(anno, mese, 1)
                ) >= 0 &&
                this.giorni_tra(
                    new Date(prenotazione.check_out),
                    new Date((mese + 1 > 11) ? anno + 1 : anno, (mese + 1 > 11) ? 0 : mese + 1, 1)
                ) >= 0
            ) {
                let inizio = new Date(prenotazione.check_in);
                for (let i = Number.parseInt(inizio.toLocaleDateString().split('/')[0]); i < 32; i++) {
                    giorniOccupati.push(i);
                }
            }

            //Il secondo filtra le prenotazioni con solo la data di
            //check_out nel mese corrente
            else if (
                this.giorni_tra(
                    new Date(prenotazione.check_in),
                    new Date(anno, mese, 1)
                ) < 0 &&
                this.giorni_tra(
                    new Date(prenotazione.check_out),
                    new Date(anno, mese, 1)
                ) >= 0 &&
                this.giorni_tra(
                    new Date(prenotazione.check_out),
                    new Date((mese + 1 > 11) ? anno + 1 : anno, (mese + 1 > 11) ? 0 : mese + 1, 1)
                ) < 0
            ) {
                let fine = new Date(prenotazione.check_out);
                for (let i = 1; i <= Number.parseInt(fine.toLocaleDateString().split('/')[0]); i++) {
                    giorniOccupati.push(i);
                }
            }

            //Il terzo filtra le prenotazioni con check_in e check_out
            //entrambi nel mese corrente
            else if (
                this.giorni_tra(
                    new Date(prenotazione.check_in),
                    new Date((mese + 1 > 11) ? anno + 1 : anno, (mese + 1 > 11) ? 0 : mese + 1, 1)
                ) < 0 &&
                this.giorni_tra(
                    new Date(prenotazione.check_in),
                    new Date(anno, mese, 1)
                ) >= 0 &&
                this.giorni_tra(
                    new Date(prenotazione.check_out),
                    new Date(anno, mese, 1)
                ) >= 0 &&
                this.giorni_tra(
                    new Date(prenotazione.check_out),
                    new Date((mese + 1 > 11) ? anno + 1 : anno, (mese + 1 > 11) ? 0 : mese + 1, 1)
                ) < 0
            ) {
                let inizio = new Date(prenotazione.check_in);
                let fine = new Date(prenotazione.check_out);
                for (let i = Number.parseInt(inizio.toLocaleDateString().split('/')[0]); i <= Number.parseInt(fine.toLocaleDateString().split('/')[0]); i++) {
                    giorniOccupati.push(i);
                }
            }

            //Il quarto filtra le prenotazioni che inglobano il mese
            else if (
                this.giorni_tra(
                    new Date(prenotazione.check_in),
                    new Date(anno, mese, 1)
                ) < 0 &&
                this.giorni_tra(
                    new Date(prenotazione.check_out),
                    new Date((mese + 1 > 11) ? anno + 1 : anno, (mese + 1 > 11) ? 0 : mese + 1, 1)
                ) >= 0
            ) {
                for (let i = 1; i < 32; i++) {
                    giorniOccupati.push(i);
                }
            }
        }

        return giorniOccupati;
    }

    render() {

        //Inizializzo la prima riga del calendario con i giorni della
        //settimana
        let calendario = [<thead key={1}>
            <tr>
                <th style={{ padding: "3px" }} >L</th>
                <th style={{ padding: "3px" }} >M</th>
                <th style={{ padding: "3px" }} >M</th>
                <th style={{ padding: "3px" }} >G</th>
                <th style={{ padding: "3px" }} >V</th>
                <th style={{ padding: "3px" }} >S</th>
                <th style={{ padding: "3px" }} >D</th>
            </tr>
        </thead>];

        //Creo le 6 (o 5) righe
        for (let i = 0; i < 6; i++) {
            let uno = this.genera(i, 1);

            //Se uno è stop vuol dire che non ci sono più 
            //date da stampare
            if (uno === 'stop') break;
            let due = this.genera(i, 2);
            let tre = this.genera(i, 3);
            let quattro = this.genera(i, 4);
            let cinque = this.genera(i, 5);
            let sei = this.genera(i, 6);
            let sette = this.genera(i, 7);
            calendario.push(
                <tbody key={Math.random()}>
                    <tr>
                        {uno}
                        {due}
                        {tre}
                        {quattro}
                        {cinque}
                        {sei}
                        {sette}
                    </tr>
                </tbody>
            );
        }

        let MESI = ['GENNAIO', 'FEBBRAIO', 'MARZO', 'APRILE', 'MAGGIO', 'GIUGNO', 'LUGLIO', 'AGOSTO', 'SETTEMBRE', 'OTTOBRE', 'NOVEMBRE', 'DICEMBRE'];

        //Se è il primo avvio mostro un pulsante
        if (this.state.chiuso) {
            return (
                <div className="my-3">
                    <button type="button" style={{ opacity: '0.8' }} className="btn btn-md btn-secondary" onClick={this.visualizza}>Giorni disponibili</button>
                </div>
            );
        }

        //Altrimenti stampo il calendario
        else {
            return (
                <div className="my-3">
                    <button type="button" style={{ opacity: '0.8' }} className="d-flex justify-content-center align-items-center btn btn-md btn-secondary" onClick={this.visualizza}>Chiudi calendario</button>
                    <h2 className="mt-2">{`${MESI[this.state.mese]} ${this.state.anno}`}</h2><br></br>
                    <div id="calendario">
                        <table>
                            {calendario}
                        </table>
                    </div>
                    <div id="calendarioPulsanti">
                        <button type="button" className="btn btn-secondary" onClick={this.indietro}>Indietro</button>
                        <button type="button" className="btn btn-secondary" onClick={this.avanti}>Avanti</button>
                    </div>
                </div>
            );
        }
    }
}

export default Calendario;