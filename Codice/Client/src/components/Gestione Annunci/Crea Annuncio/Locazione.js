import React from "react";

class Locazione extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            province: [],
            comuni: []
        };
    }

    // Gestisco il caricamento dei file json contenenti province e comuni e memorizzo i dati ottenuti nello state
    componentDidMount() {
        fetch("/javascripts/province.json")
            .then(res => res.json())
            .then(data => {
                let province = data;

                fetch("/javascripts/comuni.json")
                    .then(res => res.json())
                    .then(data => this.setState({ province, comuni: data }))
                    .catch(error => { throw error; });
            })
            .catch(error => { throw error; });
    }

    /**
     * Al momento della selezione della regione vengono caricate le province relative a quella
     * regione nella componente di input 'province' del form in modo da consentire la selezione
     * della provincia
     */
    caricaProvince = event => {
        const { value } = event.target;

        // Se i campi provincia e comune erano già selezionati, alla modifica della regione vengono deselezionati
        document.getElementById("provincia").innerHTML = "<option value='' defaultValue></option>";
        document.getElementById("comune").innerHTML = "<option value='' defaultValue></option>";

        if (value !== "") {
            this.state.province.forEach(provincia => {
                if (provincia.id_regione === value) {
                    let opt = `<option value="${provincia.id}">${provincia.nome}</option>`
                    document.getElementById("provincia").innerHTML += opt;
                }
            });
        }

        this.props.handleChange(event);
    }

    /**
     * Al momento della selezione della provincia vengono caricati i comuni relativi a quella
     * provincia nella componente di input 'comune' del form in modo da consentire la selezione
     * del comune
     */
    caricaComuni = event => {
        const { value } = event.target;

        // Se il campo comune era già selezionato, alla modifica della provincia viene deselezionato
        document.getElementById("comune").innerHTML = "<option value='' defaultValue></option>";

        if (value !== "") {
            this.state.comuni.forEach(comune => {
                if (comune.id_provincia === value) {
                    let opt = `<option value="${comune.id}">${comune.nome}</option>`
                    document.getElementById("comune").innerHTML += opt;
                }
            });
        }

        this.props.handleChange(event);
    }

    render() {
        return (
            <div>
                <label className="lead mt-3">LOCAZIONE</label>

                {/* COMPONENTE REGIONE */}
                <div className="input-group my-4">
                    <div className="input-group-prepend col-sm-3 col-12 p-0">
                        <span className="input-group-text" style={{ width: "100%" }}>Regione&nbsp;&nbsp;</span>
                    </div>
                    <select
                        id="regione"
                        name="id_regione"
                        className="custom-select col-sm-9 col-12"
                        onChange={this.caricaProvince}
                        required>
                        <option value={this.props.state.id_regione} defaultValue>
                            {this.props.state.nome_regione}
                        </option>
                        <option value="1">Piemonte</option>
                        <option value="2">Valle d'Aosta</option>
                        <option value="3">Lombardia</option>
                        <option value="4">Trentino-Alto Adige</option>
                        <option value="5">Veneto</option>
                        <option value="6">Friuli-Venezia Giulia</option>
                        <option value="7">Liguria</option>
                        <option value="8">Emilia-Romagna</option>
                        <option value="9">Toscana</option>
                        <option value="10">Umbria</option>
                        <option value="11">Marche</option>
                        <option value="12">Lazio</option>
                        <option value="13">Abruzzo</option>
                        <option value="14">Molise</option>
                        <option value="15">Campania</option>
                        <option value="16">Puglia</option>
                        <option value="17">Basilicata</option>
                        <option value="18">Calabria</option>
                        <option value="19">Sicilia</option>
                        <option value="20">Sardegna</option>
                    </select>
                </div>

                {/* COMPONENTE PROVINCIA */}
                <div className="input-group my-3">
                    <div className="input-group-prepend col-sm-3 col-12 p-0">
                        <span className="input-group-text" style={{ width: "100%" }}>Provincia&nbsp;&nbsp;</span>
                    </div>
                    <select
                        id="provincia"
                        name="id_provincia"
                        className="custom-select col-sm-9 col-12"
                        onChange={this.caricaComuni}
                        required>
                        <option value={this.props.state.id_provincia} defaultValue>
                            {this.props.state.nome_provincia}
                        </option>
                    </select>
                </div>

                {/* COMPONENTE COMUNE */}
                <div className="form-row">
                    <div className="input-group my-3 col-sm-12">
                        <div className="input-group-prepend col-sm-3 col-12 p-0">
                            <span className="input-group-text" style={{ width: "100%" }}>Comune</span>
                        </div>
                        <select
                            id="comune"
                            name="id_comune"
                            className="custom-select col-sm-9 col-12"
                            onChange={this.props.handleChange}
                            required>
                            <option value={this.props.state.id_comune} defaultValue>
                                {this.props.state.nome_comune}
                            </option>
                        </select>
                    </div>

                    {/* COMPONENTE INDIRIZZO */}
                    <div className="input-group my-3 col-md-8 col-sm-12">
                        <div className="input-group-prepend col-sm-3 col-12 p-0">
                            <span className="input-group-text" style={{ width: "100%" }}>Indirizzo</span>
                        </div>
                        <input
                            id="indirizzo"
                            name="indirizzo"
                            type="text"
                            value={this.props.state.indirizzo}
                            className="form-control col-sm-9 col-12"
                            maxLength="40"
                            onChange={this.props.handleChange}
                            required
                        />
                        <div className="invalid-feedback">
                            Inserire anche Via/Viale/Contrada
                        </div>
                    </div>

                    {/* COMPONENTE NUMERO CIVICO */}
                    <div className="input-group my-3 col-md-4 col-sm-12">
                        <div className="input-group-prepend col-md-5 col-sm-3 col-12 p-0">
                            <span className="input-group-text" style={{ width: "100%", height: "38px" }}>N. Civico</span>
                        </div>
                        <input
                            id="numero_civico"
                            name="numero_civico"
                            type="number"
                            value={this.props.state.numero_civico}
                            className="form-control col-md-7 col-sm-9 col-12"
                            maxLength="40"
                            onChange={this.props.handleChange}
                            required
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Locazione;