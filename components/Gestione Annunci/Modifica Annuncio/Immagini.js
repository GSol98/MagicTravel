import React from "react";
import Immagine from "./Immagine.js";
import InserimentoImmagineCopertina from "./InserimentoImmagineCopertina.js";
import InserimentoImmagini from "./InserimentoImmagini.js";

class Immagini extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            immagini: [],
            loading: true
        }
    }

    componentDidMount()
    {
        let imgs = [];
        this.props.state.immagini.forEach((immagine, index) => {
            if(immagine !== "00copertina.jpeg")
            {
                imgs.push(<Immagine 
                                key={index} 
                                tipo={this.props.tipo}
                                nome={immagine}
                                id_annuncio={this.props.state.id_annuncio}
                                imageDelete = {this.props.imageDelete}
                            />
                );
            }
        });
        this.setState({immagini: imgs, loading: false});
    }

    render()
    {
        return (
            <div className="mt-4">
                <label className="lead">IMMAGINI</label><br />
                
                <div className="row">
                    <InserimentoImmagineCopertina 
                        state = {this.props.state}
                        imageFetch = {this.props.imageFetch}
                    />
                    <InserimentoImmagini
                        state = {this.props.state}
                        imageFetch = {this.props.imageFetch}
                    />
                    <div id="preview"></div>
                </div>

                <div className="mt-4">
                    <label className="lead">Immagini Precedenti Annuncio</label>
                    <p style={{fontSize:"0.8em"}}>Selezionare le immagini da eliminare</p>
                    <div className="row mt-3">
                        {this.state.immagini}
                    </div>
                </div>
            </div>
        );
    }
}

export default Immagini;