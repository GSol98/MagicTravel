import React from "react";

const Pagamento = props => {
    return (
        <div className="justify-content-center mt-4 responsive">
            <form className="container was validated" onSubmit={props.paga}>
                <h5 style={{ color: "#FF8238" }}><b>Carte di pagamento accettate</b></h5>

                <div className="conteiner row justify-content-center">
                    <img className="img-fluid" id='metodiPagamento' src="/images/paypal-visa-mastercard-postepay.png" alt="metodiPagamento" width="35%" />
                </div>

                <hr color="#FF8238" />

                <h5 style={{ color: "#FF8238" }}><b>Inserisci i dati e procedi al pagamento</b></h5>

                <div className="form-group row">
                    <label htmlFor="importo" className="col-2 col-form-label">Importo</label>
                    <div className="col-10">
                        <input className="form-control" type="text" value={props.importo} id="importo" />
                    </div>
                </div>


                <div className="form-group row">
                    <label htmlFor="datetime" className="col-2 col-form-label">Data</label>
                    <div className="col-10">
                        <input className="form-control" type="datetime" value={`${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`} id="datetime" />
                    </div>
                </div>

                <div className="form-group row ">
                    <label htmlFor="titolareCarta" className="col-sm-2 col-form-label">Titolare carta</label>
                    <div className="col-sm-10 ">
                        <input className="form-control" type="text" id="titolareCarta" placeholder="Titolare carta" required="required" />
                    </div>
                </div>

                <div className="form-group row ">
                    <label htmlFor="numeroCarta" className="col-sm-2 col-form-label">Numero carta</label>
                    <div className="col-sm-10">
                        <input className="form-control" id="numeroCarta" pattern="^[0-9]{4}[-][0-9]{4}[-][0-9]{4}[-][0-9]{4}$" type="text" placeholder="XXXX-XXXX-XXXX-XXXX" required="required" />
                    </div>
                </div>

                <div className="form-group row">
                    <label htmlFor="numeroCarta" className="col-sm-2 col-form-label">Scadenza </label>

                    <div className="col-sm-5">
                        <select className="form-control" id="mese" required>
                            <option defaultValue></option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            <option>6</option>
                            <option>7</option>
                            <option>8</option>
                            <option>9</option>
                            <option>10</option>
                            <option>11</option>
                            <option>12</option>
                        </select>
                    </div>

                    <div className="col-sm-5">
                        <select className="form-control" id="anno" required>
                            <option defaultValue></option>
                            <option>2020</option>
                            <option>2021</option>
                            <option>2022</option>
                            <option>2023</option>
                            <option>2024</option>
                            <option>2025</option>
                            <option>2026</option>
                            <option>2027</option>
                            <option>2028</option>
                            <option>2029</option>
                            <option>2030</option>
                            <option>2031</option>
                        </select>
                    </div>
                </div>

                <hr color="#FF8238" />

                <div>
                    <button style={{ float: "right" }} className="btn btn-primary btn-lg center" id='pulsantePagamento'>Prosegui</button>
                </div>
                <br /><br /><br />
            </form>
        </div>
    );

}

export default Pagamento;