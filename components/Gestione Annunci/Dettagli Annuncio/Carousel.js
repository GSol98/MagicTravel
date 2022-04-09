import React from "react";

const Carousel = props => {
    let immagini = [];
    let indicatori = [];
    let tipo = props.state.tipo_alloggio === "B&B" ? "B&B" : "CasaVacanze";

    props.state.immagini.forEach((immagine, index) => {
        indicatori.push(
            <li data-target="#demo" key={index} data-slide-to={index}></li>
        );

        if (index === 0) {
            immagini.push(
                <div className="carousel-item active" key={index}>
                    <div className="d-flex justify-content-center align-items-center">
                        <a href={`https://${window.location.hostname}:9000/images/ImmaginiAnnunci/${tipo}${props.state.id_annuncio}/00copertina.jpeg`} target="_blank" rel="noopener noreferrer">
                            <img
                                src={`/images/ImmaginiAnnunci/${tipo}${props.state.id_annuncio}/00copertina.jpeg`}
                                alt={`Immagine${index}Annuncio${props.state.id_annuncio}`}
                                style={{ maxHeight: "400px", height: "55vw" }}
                            />
                        </a>
                    </div>
                </div>
            );
        }
        else {
            immagini.push(
                <div className="carousel-item" key={index}>
                    <div className="d-flex justify-content-center align-items-center">
                        <a href={`https://${window.location.hostname}:9000/images/ImmaginiAnnunci/${tipo}${props.state.id_annuncio}/${immagine}`} target="_blank" rel="noopener noreferrer">
                            <img
                                src={`/images/ImmaginiAnnunci/${tipo}${props.state.id_annuncio}/${immagine}`}
                                alt={`Immagine${index}Annuncio${props.state.id_annuncio}`}
                                style={{ maxHeight: "400px", height: "55vw" }}
                            />
                        </a>
                    </div>
                </div>
            );
        }
    });

    return (
        <div style={{ marginTop: '80px' }}>
            <h4>
                - Foto annuncio
            </h4>
            <div className="mt-3 d-flex justify-content-center align-items-center p-2">
                <div id="demo" className="carousel slide col-md-10 col-sm-11 col-12 rounded" data-ride="carousel" style={{ backgroundColor: "black"}}>
                    <ul className="carousel-indicators">
                        {indicatori}
                    </ul>

                    <div className="carousel-inner">
                        {immagini}
                    </div>

                    <a className="carousel-control-prev" href="#demo" data-slide="prev">
                        <span className="carousel-control-prev-icon"></span>
                    </a>
                    <a className="carousel-control-next" href="#demo" data-slide="next">
                        <span className="carousel-control-next-icon"></span>
                    </a>
                </div>
            </div>
        </div>

    );
}

export default Carousel;