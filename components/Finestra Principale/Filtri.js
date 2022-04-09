import React from 'react';

class Filtri extends React.Component {

    constructor() {
        super();

        this.state = {
            filtri: [
                'Tipo alloggio',
                'Fascia di prezzo',
                'Periodo prenotazione',
                'Numero viaggiatori',
                'Altro...'
            ],
            filtro: 0
        }
    }

    //======================================
    //Funzione riempiAltro()
    //======================================

    //Restituisce il contenitore con tutti i vari filtri selezionabili
    riempiAltro = () => {

        //Creo un array con i vari filtri
        let filtri = ['wifi', 'televisore', 'ascensore', 'parcheggio', 'animali', 'fumatori', 'ariaCondizionata', 'riscaldamenti', 'trasporti', 'microonde', 'lavastoviglie', 'frigorifero', 'forno', 'lavabiancheria', 'asciugatrice', 'phon', 'ferroDaStiro', 'telecamere', 'estintore', 'allarmeFurto', 'allarmeIncendio'];

        //Creo un array e inserisco tutti i filtri
        let arr = [];

        //Aggiongo la possibilità di selezionarli tutti
        arr.push(
            <div key={-1}>
                <label className="font-weight-bold">
                    <input
                        className="m-2"
                        type="checkbox"
                        id={-3}
                        name={'all'}
                        onChange={this.props.handleChange}
                    />
                    Seleziona tutto
                </label>
            </div>
        );

        for (let [index, filtro] of filtri.entries())
            arr.push(
                <div key={index}>
                    <label className="font-weight-bold">
                        <input
                            className="m-2 filtriAggiuntiviRicerca"
                            type="checkbox"
                            id={index}
                            name={'altro'}
                            value={filtro}
                            onChange={this.props.handleChange}
                        />
                        {filtro.toLocaleLowerCase()}
                    </label>
                </div>
            );

        return arr;
    }

    //======================================
    //Funzione render()
    //======================================

    //Permette di selezionare il filtro
    cambiaFiltro = event => {
        const { value } = event.target;

        this.setState({
            filtro: Number.parseInt(value)
        });
    }

    //======================================
    //Funzione render()
    //======================================

    render() {

        //Controllo se l'utente ha selezionato dei filtri e li mostro
        let risultati = [];
        let controllo = false;

        //Controllo il tipo di alloggio
        if (this.props.state.tipoAnnuncio !== '') {
            risultati.push(<p key={1} className='m-0'>- Tipo annuncio: {this.props.state.tipoAnnuncio === 'CasaVacanze' ? 'casa vacanze' : 'b&b'}</p>);
            controllo = true;
        }

        //Controllo la fascia di prezzo
        if (this.props.state.prezzo !== '') {
            risultati.push(<p key={2} className='m-0'>- Prezzo: meno di {this.props.state.prezzo}</p>);
            controllo = true;
        }

        let erroreData = '';
        //Controllo il periodo
        if (this.props.controlloDate()) {
            risultati.push(<p key={3} className='m-0'>- Periodo: dal {this.props.state.dal} al {this.props.state.al}</p>);
            controllo = true;
        }
        else
            //Per evitare segnalazioni inutili, controllo se l'utente ha inserito le date
            if (this.props.state.dal !== '' || this.props.state.al !== '')
                erroreData = <p className="text-danger">Date non valide!</p>

        let errorePersone = '';
        //Controllo il numero di persone
        console.log(this.props.state.persone)
        if (!isNaN(Number.parseInt(this.props.state.persone))) {
            risultati.push(<p key={4} className='m-0'>- Numero viaggiatori {this.props.state.persone}</p>);
            controllo = true;

            //Controllo che non sia un valore non valido
            if (!(Number.parseInt(this.props.state.persone) > 0))
                errorePersone = <p className="text-danger">Numero viaggiatori non valido!</p>
        }

        //Controllo se sono stati inseriti dei filtri aggiuntivi
        if (this.props.state.altro.length !== 0) {
            risultati.push(<p key={5} className='m-0'>- Filtri aggiuntivi selezionati</p>);
            controllo = true;
        }

        //Preparo la lista da stampare
        let lista = [];
        for (let [index, filtro] of this.state.filtri.entries()) {
            if (index === this.state.filtro)
                lista.push(<button key={index} value={`${index}`} onClick={this.cambiaFiltro} type="button" className="btn btn-secondary list-group-item list-group-item-action active">{filtro}</button>);
            else
                lista.push(<button key={index} value={`${index}`} onClick={this.cambiaFiltro} type="button" className="btn btn-secondary list-group-item list-group-item-action">{filtro}</button>);
        }

        //Seleziono il filtro da stampare
        let filtro;
        switch (this.state.filtro) {

            //Se è il tipo di annuncio
            case 0:
                filtro = <div>
                    <label className="font-weight-bold" htmlFor="validationDefault04">Tipo annuncio</label>
                    <select key={0} className="custom-select" name="tipoAnnuncio" onChange={this.props.handleChange}>
                        <option value="" defaultValue></option>
                        <option value="BeB">B&B</option>
                        <option value="CasaVacanze">Casa Vacanze</option>
                    </select>
                </div>;
                break;

            //Se è la fascia di prezzo
            case 1:
                filtro = <div>
                    <label className="font-weight-bold" htmlFor="validationDefault04">Fascia di prezzo</label>
                    <select key={1} className="custom-select" title="Fascia di prezzo" placeholder="Fascia di prezzo" name="prezzo" onChange={this.props.handleChange}>
                        <option value="" title="Prezzo" data-content="Annulla <span className='reset-label'></span>" />
                        <option value="50">{"< 50"}</option>
                        <option value="100">{"< 100"}</option>
                        <option value="200">{"< 200"}</option>
                        <option value="300">{"< 300"}</option>
                    </select>
                </div>;
                break;

            //Se è il periodo
            case 2:
                filtro = <form key={2}>
                    <label className="font-weight-bold" htmlFor="date-input">Check-in</label>
                    <input
                        className="form-control"
                        type="date"
                        name="dal"
                        value={this.props.state.dal}
                        onChange={this.props.handleChange}
                    />
                    <label className="font-weight-bold mt-2" htmlFor="date-input">Check-out</label>
                    <input
                        id="Al"
                        className="form-control"
                        type="date"
                        name="al"
                        value={this.props.state.al}
                        onChange={this.props.handleChange}
                    />
                    {erroreData}
                </form>;
                break;

            //Se è il numero di persone
            case 3:
                filtro = <div>
                    <label className="font-weight-bold" htmlFor="numero-viaggiatori">Numero viaggiatori</label>
                    <input
                        className="form-control"
                        type='number'
                        min="1"
                        name='persone'
                        value={this.props.state.persone}
                        onChange={this.props.handleChange}
                    />
                    {errorePersone}
                </div>
                break;

            //Se si selezionano gli altri filtri
            case 4:
                filtro = <div id='contenitoreFiltri' style={{ overflow: 'scroll', height: '270px' }}>{this.riempiAltro()}</div>;
                break;

            default:
                break;
        }

        //Se non sono stati scelti filtri
        if (!controllo)
            risultati.push(<p key={4}>Nessun filtro selezionato</p>);

        return (
            <div className='p-3 container'>
                <div style={{ backgroundColor: 'white', border: '2px solid black', padding: '20px' }}>
                    <div className='row'>
                        <div className='col-md-4 col-12'>
                            <div className='list-group my-3'>
                                {lista}
                            </div>
                        </div>
                        <div className='col-md-4 col-12 mt-2'>
                            {filtro}
                        </div>
                        <div className='col-md-4 col-12'>
                            <h5 className='mt-2'>Filtri selezionati</h5>
                            {risultati}
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

export default Filtri;