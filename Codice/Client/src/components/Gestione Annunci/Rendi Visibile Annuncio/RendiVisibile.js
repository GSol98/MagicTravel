import React from "react";

class NascondiAnnuncio extends React.Component {
    render() {
        // Se l'annuncio non è visibile mostro il bottone per renderlo visibile
        if(this.props.state.nascosto === 1){   
            return(
                <div>
                    <button
                        className="btn btn-secondary" 
                        value={`${this.props.state.tipo_alloggio === "B&B" ? "B" : "C"}${this.props.state.id_annuncio}`} 
                        onClick={this.props.mostra}>
                        Rendi Visibile Annuncio
                    </button>
                    <p style={{fontSize:"0.7em"}}>L'annuncio sarà visibile agli altri utenti</p>
                </div>
            );      
        }
        return <div></div>;
    }
}

export default NascondiAnnuncio;