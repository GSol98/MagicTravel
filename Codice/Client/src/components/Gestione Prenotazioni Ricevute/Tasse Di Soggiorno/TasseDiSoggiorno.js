import React from "react";
 
class TasseDiSoggiorno extends React.Component {

    render() {
        
        //Se non sono ancora state pagate le tasse mostro il conteggio e stampo un bottone che ne permette
        //il pagamento
        if(this.props.tasse === 0) {
            return(
                <div id="corpoTasseDiSoggiorno1">
                    <h4>Tassa di soggiorno</h4>
                    <div id="sottoCorpoTassaSoggiorno1">
                        <p className="mb-0">Stato: {this.props.statoTassaDiSoggiorno}</p>
                        <p className="my-0">Numero clienti: {this.props.numeroPersone}</p>
                        <p className="my-0">Tassa a persona: €{this.props.tassaAPersona}</p>
                        <p className="my-0">Giorni pernottamento: {this.props.giorniPernottamento} giorni</p>
                        <p className="mt-0">Totale da pagare: €{this.props.numeroPersone*this.props.tassaAPersona*this.props.giorniPernottamento}</p>
                        <button id='bottoneTassaSoggiorno' onClick={this.props.pagaTasse} className="btn btn-secondary btn-sm">Paga</button>
                    </div>
                </div>
            );
        }

        //Se le tasse sono già state pagate, mostro l'importo
        else {
            return(
                <div id="corpoTasseDiSoggiorno2">
                    <h4>Tassa di soggiorno</h4>
                    <div id="sottoCorpoTassaSoggiorno2">
                        <p className="mb-0">Stato: {this.props.statoTassaDiSoggiorno}</p>
                        <p className="mt-0">Importo: €{this.props.tasse}</p>
                    </div>
                    
                </div>
            );
        }
    }
}

export default TasseDiSoggiorno;
