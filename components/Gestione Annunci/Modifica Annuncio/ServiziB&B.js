import React from "react";
import InfoCamere from "./infoCamereB&B.js";
import contaStanze from "../../../functions/ContaStanze.js";

class Servizi extends React.Component
{                          
    constructor(props)
    {
        super(props);
        this.state = {
            infoCamere: [],
            count: 0
        }
    }

    // All'avvio mostro un solo componente per l'inserimento delle camere, numero posti letto e prezzo
    componentDidMount = () => {
        let camere = [];
        let count = 0;

        let numero_stanze = contaStanze(this.props.stanze);
        numero_stanze.forEach((stanza, i) => {
            if(stanza !== 0)
            {
                camere.push(<InfoCamere 
                                key={i}
                                count = {count}
                                numero_posti_letto={i}
                                prezzo={this.props.stanze.find(stanza => stanza.numero_posti_letto === i).prezzo}
                                numero_stanze={stanza} 
                                handleChange={this.props.handleChange}
                            />
                );
                count++;
            }
        })

        this.setState({infoCamere: camere, count: camere.length});
    }

    // Al click del + aggiungo un altro componente per l'inserimento delle camere, numero posti letto e prezzo
    aggiungi = () => {
        this.setState(prevState => { return { count: prevState.count + 1 }; });
        let camere = this.state.infoCamere;
        camere.push(<InfoCamere key={this.state.count} state={this.props} count={this.state.count} handleChange={this.props.handleChange}/>);
        this.setState({infoCamere: camere});
    }

    // Al clik del - rimuovo un componente per l'inserimento delle camere, numero posti letto e prezzo
    rimuovi = () => {
        if(this.state.infoCamere.length !== 1)
        {
            this.setState(prevState => { return { count: prevState.count - 1 }; });
            let camere = this.state.infoCamere;
            camere.pop();
            this.setState({infoCamere: camere});  
        }
        else
            alert("Almeno un campo necessario");
    }

    render()
    {
        return (
            <div className="mt-5 container">
                <div className="row">
                    <label className="lead">SERVIZI STRUTTURA</label>
                    <div className="mx-3">
                        <img src="/images/icon/icons8-piu-26.png" alt="aggiungi" onClick={this.aggiungi}/>
                    </div>
                    <div>
                        <img src="/images/icon/icons8-meno-26.png" alt="rimuovi" onClick={this.rimuovi}/>
                    </div>
                </div>
                <p style={{fontSize:"0.8em"}}>E' necessario reinserire i dati riguardanti le stanze della struttura.
                    Nei placeholder sono riportati i vecchi valori.
                </p>

                <div id="camere" className="ml-2">
                    {this.state.infoCamere}
                </div>
            </div>
        );
    }
};

export default Servizi;
