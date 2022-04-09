import React from "react";
import InfoCamere from "./infoCamereB&B.js";


class Servizi extends React.Component
{                          
    constructor(props)
    {
        super(props);
        this.state = {
            infoCamere: [],
            count: 1
        }
    }

    // All'avvio mostro un solo componente per l'inserimento delle camere, numero posti letto e prezzo
    componentDidMount = () => {
        let camere = [];
        camere.push(<InfoCamere key={0} state={this.props} count={0} handleChange={this.props.handleChange}/>);
        this.setState({infoCamere: camere});
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
            <div className="mt-5">
                <div className="row">
                    <label className="lead">SERVIZI STRUTTURA</label>
                    <div className="mx-3">
                        <img src="/images/icon/icons8-piu-26.png" alt="aggiungi" onClick={this.aggiungi}/>
                    </div>
                    <div>
                        <img src="/images/icon/icons8-meno-26.png" alt="rimuovi" onClick={this.rimuovi}/>
                    </div>
                </div>

                <div id="camere" className="ml-1">
                    {this.state.infoCamere}
                </div>
            </div>
        );
    }
};

export default Servizi;