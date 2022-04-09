import React from "react";

class NascondiAnnuncio extends React.Component {
    render() {
        // Se l'annuncio è visibile mostro il bottone per nasconderlo
        if(this.props.state.nascosto === 0){   
            return(     
                    <div>
                        <button
                            className="btn btn-secondary" 
                            value={`${this.props.state.tipo_alloggio === "B&B" ? "B" : "C"}${this.props.state.id_annuncio}`} 
                            onClick={this.props.nascondi}>
                            Nascondi Annuncio
                        </button>
                        <p style={{fontSize:"0.7em"}}>L'annuncio non sarà più visibile<br/>agli altri utenti</p>
                    </div>
            )
        }
        return <div></div>;
    }
}

export default NascondiAnnuncio;