import React from "react";
import ControlloServizioAggiuntivo from "../../../functions/ControlloServizioAggiuntivo.js";

const ServiziAggiuntivi = props => {
    let servizi = [];
    for (let servizio in props.state) {
        if (props.state[servizio] === 1 && ControlloServizioAggiuntivo(servizio)) {
            let src = `/images/icon/ServiziAggiuntivi/${servizio}.png`;
            let label = assignLabel(servizio);

            servizi.push(
                <div className="my-2 col-sm-4 col-6" key={servizio}>
                    <div className="d-flex justify-content-center align-items-center">
                        <img src={src} alt={servizio} style={{ height: "28px", width: "28px" }} />
                    </div>
                    <p style={{ textAlign: "center" }}>{label}</p>
                </div>
            )
        }
    }

    if (servizi.length !== 0)
        return (
            <div style={{ marginTop: '80px' }} className="mb-2 col-xl-8 col-lg-9 col-md-10 col-sm-11 col-12">
                <h4>- Servizi aggiuntivi</h4>
                <div className="row mt-5"> {servizi} </div>
            </div>
        );

    else
        return (<div></div>);
};

const assignLabel = servizio => {
    switch (servizio) {
        case "animali":
            return "animali non ammessi";

        case "fumatori":
            return "vietato fumare";

        case "ariaCondizionata":
            return "aria condizionata";

        case "trasporti":
            return "trasporti nelle vicinanze";

        case "ferroDaStiro":
            return "ferro da stiro";

        case "telecamere":
            return "telecamere di sicurezza";

        case "allarmeFurto":
            return "allarme antifurto";

        case "allarmeIncendio":
            return "allarme antincendio";

        default:
            return servizio;
    }
}

export default ServiziAggiuntivi;