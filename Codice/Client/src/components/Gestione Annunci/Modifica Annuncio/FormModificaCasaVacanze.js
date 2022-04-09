import React from "react";
import TitoloAnnuncio from "../Crea Annuncio/TitoloAnnuncio.js";
import Locazione from "../Crea Annuncio/Locazione.js";
import Descrizione from "../Crea Annuncio/Descrizione.js";
import Servizi from "../Crea Annuncio/ServiziCasaVacanze.js";
import ServiziAggiuntivi from "../Crea Annuncio/ServiziAggiuntivi.js";
import Immagini from "./Immagini.js";
import CostoMensile from "../Crea Annuncio/Costo.js";
import TassaDiSoggiorno from "../Crea Annuncio/TassaDiSoggiorno.js";

class FinestraModificaCasaVacanze extends React.Component {

    render() {
        /**
         * Riutilizzo le stesse componenti di creazione annuncio a cui vengono subito assegnati i valori
         * recuperati dal database
         */
        return (
            <form className="container was-validated" onSubmit={this.props.handleSubmit}>
                <label className="lead" style={{ fontSize: "1.3em" }}>Tipo Alloggio: <strong>{this.props.state.tipo_alloggio}</strong></label>

                <TitoloAnnuncio
                    state={this.props.state}
                    handleChange={this.props.handleChange}
                />

                <Locazione
                    state={this.props.state}
                    handleChange={this.props.handleChange}
                />

                <Descrizione
                    state={this.props.state}
                    handleChange={this.props.handleChange}
                />

                <Servizi
                    state={this.props.state}
                    handleChange={this.props.handleChange}
                />

                <ServiziAggiuntivi
                    state={this.props.serviziAggiuntivi}
                    handleChange={this.props.handleChangeServiziAggiuntivi}
                />

                <Immagini
                    state={this.props.state}
                    tipo="CasaVacanze"
                    imageFetch={this.props.imageFetch}
                    imageDelete={this.props.imageDelete}
                />

                <div className="row">
                    <CostoMensile
                        state={this.props.state}
                        handleChange={this.props.handleChange}
                    />

                    <TassaDiSoggiorno
                        state={this.props.state}
                        handleChange={this.props.handleChange}
                    />
                </div>
                <button style={{ float: "right" }} className="btn btn-secondary mt-5">Modifica</button>
                <br /><br /><br />
            </form>
        )
    }
}

export default FinestraModificaCasaVacanze;