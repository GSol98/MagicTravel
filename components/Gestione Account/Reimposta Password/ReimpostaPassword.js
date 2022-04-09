import React from "react";

/**
 * La finestra consente ad un utente che ha dimenticato la password di reimpostarla.
 * Viene richiesto l'nserimento del'indirizzo mail col quale l'utente si sera registrato
 * e viene inviata una mail a questo indirizzo contenente una nuova password.
 */

class ReimpostaPassword extends React.Component {
    constructor() {
        super();
        this.state = {
            email: ""
        };
    }

    // Gestisco la modifica dello state
    handleChange = event => { this.setState({ email: event.target.value }); }

    // Gestisco la consegna del form che consiste nel postare l'indirizzo mail inserito al server
    handleSubmit = event => {
        event.preventDefault();

        fetch("gestione_account/reimposta_password", {
            method: "POST",
            body: JSON.stringify({ email: this.state.email }),
            headers: { "Content-Type": "application/json" }
        })
            .then(res => {
                if (res.status === 500)      // Caso di errore
                    throw new Error();
                else if (res.status === 404)     // Caso in cui l'indirizzo mail non è presente nel database
                    alert("L'indirizzo email inserito non è presente nel database");
                else {                   // Caso di successo
                    alert("Mail Inviata Correttamente");
                    window.location.href = "/Login";
                }
            })
            .catch(err => alert("Mail non inviata: Errore interno"));
    }

    render() {
        return (
            <div className="mt-5 d-flex justify-content-center align-items-center" id='backgroundMain'>
                <div style={{ width: "330px", height: "270px", marginTop: "50px", marginBottom: "50px" }}>
                    <div className="p-4">
                        <label className="lead text-white font-weight-bold" style={{ fontSize: "1.5em", textShadow: "3px 3px 5px black" }}>Reimposta Password</label>
                        <form onSubmit={this.handleSubmit}>
                            <label className="my-3 text-white font-weight-bold" htmlFor="email" style={{ textShadow: "3px 3px 5px black" }}>
                                Inserire l'indirizzo mail usato in fase di registrazione
                                <input
                                    name="email"
                                    type="email"
                                    value={this.state.email}
                                    className="form-control mt-2"
                                    placeholder="email"
                                    onChange={this.handleChange}
                                    required
                                >
                                </input>
                            </label>

                            <button className="btn btn-secondary float-right">Invia</button>
                        </form>

                        <p className="text-white font-weight-bold" style={{ fontSize: "0.8em", textShadow: "3px 3px 5px black" }}>
                            Ti verrà inviata una mail <br />
                            con una nuova password
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default ReimpostaPassword;