import React from "react";

class BarraNavigazione extends React.Component {
    render() {

        //Creo l'array che conterrà gli elementi che verranno renderizzati e acquisisco la pagina che ho stampato
        //in modo da adattare la barra
        let bottoni = [];
        let pagina = this.props.pagina_attuale;

        //Se ci sono più di otto pagine la barra avrà una forma compatta in modo da non causare errori di overflow
        if (this.props.numero_pagine > 7) {

            //Inizializzo un variabile per evitare di stampare due volte i valori centrali
            let passa = false;

            //Nella prima posizione inserisco o 1 o ...
            if (pagina <= 3) {
                for (let i = 1; i <= 4; i++)
                    bottoni.push(<li key={i} className={`page-item ${pagina === i ? 'active' : ''}`} aria-current="page"><button value={i} onClick={this.props.cambia_pagina} className="page-link">{i}</button></li>);
                passa = true;
            }
            else
                bottoni.push(<li key={1} className="page-item" aria-current="page"><button className="page-link">...</button></li>);

            //Inizializzo una variabile per non ripetere gli ultimi pulsanti nel caso in cui
            //mi trovi nelle ultime posizioni
            let ultime = false;

            //Controllo se sono stati stampati i pulsanti centrali
            if (!passa) {

                //Controllo se è negli ultimi posti
                if (this.props.numero_pagine - pagina < 3) {
                    for (let i = this.props.numero_pagine - 4; i <= this.props.numero_pagine; i++)
                        bottoni.push(<li key={i} className={`page-item ${pagina === i ? 'active' : ''}`} aria-current="page"><button value={i} onClick={this.props.cambia_pagina} className="page-link">{i}</button></li>);
                    ultime = true;
                }
                else
                    for (let i = pagina - 1; i <= pagina + 1; i++)
                        bottoni.push(<li key={i} className={`page-item ${pagina === i ? 'active' : ''}`} aria-current="page"><button value={i} onClick={this.props.cambia_pagina} className="page-link">{i}</button></li>);
            }

            //Controllo se gli ultimi pulsanti sono già stati stampati
            if (!ultime) {
                bottoni.push(<li key={this.props.numero_pagine - 1} className={`page-item`} aria-current="page"><button className="page-link">...</button></li>);
                bottoni.push(<li key={this.props.numero_pagine} className={`page-item ${pagina === this.props.numero_pagine ? 'active' : ''}`} aria-current="page"><button value={this.props.numero_pagine} onClick={this.props.cambia_pagina} className="page-link">{this.props.numero_pagine}</button></li>);
            }
        }

        //Se ci sono meno di sette pagine la forma non è compatta
        else {

            //Creo un for per inserire i bottoni nell'array creato precedentemente
            for (let i = 1; i <= this.props.numero_pagine; i++) {

                //Il bottone della pagina corrente deve essere sempre attivo
                if (i === pagina) {
                    bottoni.push(<li key={i} className="page-item active" aria-current="page"><button className="page-link">{i}</button></li>)
                    continue;
                }
                bottoni.push(<li key={i} className="page-item"><button className="page-link" value={i} onClick={this.props.cambia_pagina}>{i}</button></li>);
            }
        }

        return (
            <div className="mx-4">
                <nav aria-label="Search results pages">
                    <ul className="pagination justify-content-end">
                        {bottoni}
                    </ul>
                </nav>
            </div>
        );
    }
}

export default BarraNavigazione;