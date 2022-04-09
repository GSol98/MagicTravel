import React from "react";
import decripta from "../../../functions/decripta.js";

// La finestra consente all'utente di modificare la propria password
class ModificaPassword extends React.Component {
    constructor() {
        super();
        this.state = {
            passVecchia: "",
            passNuova: "",
            confermaPass: "",
            coincidenza: ""
        }
    }

    // Gestisco la modifica dello state per ogni dato inserito nel form
    handleChange = event => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    // Gestisco la consegna dei dati: posto lo state al server
    handleSubmit = event => {
        event.preventDefault();

        if(this.state.passNuova === this.state.confermaPass) {

            let id = decripta(window.sessionStorage.getItem("id_account"), window.sessionStorage.getItem("email"))
            fetch("/gestione_account/modifica_password", {
                method: "POST",
                body: JSON.stringify({
                    id_account: id,
                    state: this.state
                }),
                headers: { "Content-Type": "application/json" }
            })
            .then(res => {
                if (res.status === 500)
                    throw new Error();
                else {
                    alert("Password Modificata");
                    window.location.href = "/";
                }
            })
            .catch(err => alert("Impossibile Modificare: password vecchia errata"));
        }
        else    
            alert('Le password non coincidono');
    }

    render() {
        return (
            <div className="mt-5 d-flex justify-content-center align-items-center" id='backgroundMain'>
                <div style={{ width: "270px", height: "460px", marginTop: "30px" }}>
                    <div className="p-4">
                        <label className="lead text-white font-weight-bold" style={{ fontSize: "1.5em", textShadow: "3px 3px 5px black" }}>Modifica Password</label>
                        <form onSubmit={this.handleSubmit}>
                            <label className="text-white font-weight-bold" htmlFor="passVecchia" style={{ textShadow: "3px 3px 5px black", width: "100%" }}>
                                Vecchia Password
                                <input
                                    name="passVecchia"
                                    type="password"
                                    value={this.state.passVecchia}
                                    className="form-control"
                                    onChange={this.handleChange}
                                    required
                                >
                                </input>
                            </label>

                            <label className="my-2 text-white font-weight-bold" htmlFor="passNuova" style={{ textShadow: "3px 3px 5px black", width: "100%" }}>
                                Nuova Password
                                <input
                                    name="passNuova"
                                    type="password"
                                    value={this.state.passNuova}
                                    className="form-control"
                                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$"
                                    onChange={this.handleChange}
                                    required
                                >
                                </input>
                                <p style={{ fontSize: "0.7em" }}>Almeno 8 caratteri tra cui uno maiuscolo, uno minuscolo e un numero</p>
                            </label>

                            <label className="text-white font-weight-bold" htmlFor="confermaPass" style={{ textShadow: "3px 3px 5px black", width: "100%" }}>
                                Conferma Password
                                <input
                                    name="confermaPass"
                                    type="password"
                                    value={this.state.confermaPass}
                                    className="form-control"

                                    onChange={this.handleChange}
                                    required
                                >
                                </input>
                                <div className='valid-feedback text-white' style={{textShadow:'3px 3px 5px black'}}>{this.state.coincidenza}</div>
                            </label>
                            <button id="invia" className="mt-3 btn btn-secondary float-right">Invia</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default ModificaPassword;
