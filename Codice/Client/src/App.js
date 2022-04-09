import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import ControlloPath from "./functions/ControlloPath.js";

//Elementi comuni
import Header from "./common/Header.js";
import NavbarLogin from "./common/NavbarLogin.js"
import NavbarLogged from "./common/NavbarLogged.js";
import Footer from "./common/Footer.js";

//Import Finestra Principale
import FinestraPrincipale from "./components/Finestra Principale/FinestraPrincipale.js";

//Import per Gestione Account
import GestioneEconomica from "./components/Gestione Account/Gestione Economica/GestioneEconomica.js";
import Login from "./components/Gestione Account/Login/Login.js";
import ModificaPassword from "./components/Gestione Account/Modifica Password/ModificaPassword.js";
import Registrazione from "./components/Gestione Account/Registrazione/Registrazione.js";
import ReimpostaPassword from "./components/Gestione Account/Reimposta Password/ReimpostaPassword.js";

//Import per Gestione Annunci
import CreaAnnuncio from "./components/Gestione Annunci/Crea Annuncio/CreaAnnuncio.js";
import ListaAnnunci from "./components/Gestione Annunci/Lista Annunci/ListaAnnunci.js";
import DettagliAnnuncio from "./components/Gestione Annunci/Dettagli Annuncio/DettagliAnnuncio.js";
import ModificaAnnuncio from "./components/Gestione Annunci/Modifica Annuncio/ModificaAnnuncio.js";

//Import per Ricerca e Prenota
import AnnunciRicerca from "./components/Ricerca e Prenota/Ricerca/AnnunciRicerca.js";
import DettagliAnnuncioRicerca from "./components/Ricerca e Prenota/Dettagli Annuncio Ricerca/DettagliAnnuncio.js";
import RichiestaPrenotazione from "./components/Ricerca e Prenota/Richiesta Prenotazione/RichiestaPrenotazione.js";

//Import per Gestione Prenotazioni Ricevute
import AnnullaPrenotazioneRicevuta from "./components/Gestione Prenotazioni Ricevute/Annulla Prenotazione Ricevuta/AnnullaPrenotazioneRicevuta.js";
import DettagliPrenotazioneRicevuta from "./components/Gestione Prenotazioni Ricevute/Dettagli Prenotazione Ricevuta/DettagliPrenotazioneRicevuta.js";
import ListaPrenotazioniRicevute from "./components/Gestione Prenotazioni Ricevute/Lista Prenotazioni Ricevute/ListaPrenotazioniRicevute.js";

//Import per Gestione Prenotazioni Effettuate
import AnnullaPrenotazioneEffettuata from "./components/Gestione Prenotazioni Effettuate/Annulla Prenotazione Effettuata/AnnullaPrenotazioneEffettuata.js";
import DettagliPagamento from "./components/Gestione Prenotazioni Effettuate/Dettagli Pagamento/DettagliPagamento.js";
import DettagliPrenotazioneEffettuata from "./components/Gestione Prenotazioni Effettuate/Dettagli Prenotazione Effettuata/DettagliPrenotazioneEffettuata.js";
import EffettuaPagamento from "./components/Gestione Prenotazioni Effettuate/Effettua Pagamento/EffettuaPagamento.js";
import ListaPrenotazioniEffettuate from "./components/Gestione Prenotazioni Effettuate/Lista Prenotazioni Effettuate/ListaPrenotazioniEffettuate.js";

class App extends React.Component
{
    constructor() {
        super();
        this.state = {
            stato: ''
        };
    }

    //==============================
    //Funzione componentDidMount()
    //==============================

    componentDidMount() {

        //Controllo se l'id e l'email in session storage sono validi
        if(sessionStorage.getItem('id_account') && sessionStorage.getItem('email')) {
            fetch('/autenticazione/controllo', {
                method: "POST", 
                body: JSON.stringify({
                    id: sessionStorage.getItem('id_account'),
                    email: sessionStorage.getItem('email')
                }),
                headers: {"Content-Type": "application/json"}
            })
            .then(res => res.json())
            .then(data => {
                this.setState({
                    stato: data.messaggio
                });
            })
            .catch(err => { throw err; });
        }
        else
            this.setState({
                stato: 'noLog'
            });
    }

    //=========================
    //Funzione render()
    //=========================
    render() {
        
        //Prima ri renderizzare la pigina aspetto che venga impostato il valore di stato
        if(this.state.stato === '')
            return <div></div>;

        //Variabile che contiene il corpo da stampare
        let corpo;

        //Controllo se esiste la rotta cercata
        if(!ControlloPath(window.location.pathname, this.state.stato)) {

            //Se non esiste stampo 404 Not Found
            return (
                <div className="m-5">
                    <h1 style={{fontSize:"5vw", height:"100px", lineHeight:"100px", borderBottom:"1px solid black"}}>Error 404: Not Found</h1>
                    <p style={{fontSize:"3vw", height:"100px", lineHeight:"100px"}}>La pagina non esiste</p>
                </div>  
            );
        }

        //Se l'utente non ha fatto il login allora potrà navigare su queste rotte
        if(this.state.stato === 'noLog')
            corpo = (<BrowserRouter>
                        <Route exact path="/" component={FinestraPrincipale}/>
                        <Route exact path="/VisualizzaAnnunciRicerca" component= {AnnunciRicerca} />
                        <Route exact path="/DettagliAnnuncioRicerca" component={DettagliAnnuncioRicerca}/>
                        <Route exact path="/Registrazione" component={Registrazione} />
                        <Route exact path="/Login" component={Login} />
                        <Route exact path="/ReimpostaPassword" component={ReimpostaPassword} />
                    </BrowserRouter>);
        
        //Se l'utente ha fatto il login allora potrà navigare su queste rotte
        else if(this.state.stato === 'log')
            corpo = (
                <BrowserRouter>
                    <Route exact path="/" component={FinestraPrincipale}/>
                    <Route exact path="/VisualizzaAnnunciRicerca" component= {AnnunciRicerca} />
                    <Route exact path="/DettagliAnnuncioRicerca" component={DettagliAnnuncioRicerca}/>
                    <Route exact path="/CreaAnnuncio" component={CreaAnnuncio}/>
                    <Route exact path="/VisualizzaListaAnnunci" component={ListaAnnunci}/>
                    <Route exact path="/DettagliAnnuncio" component={DettagliAnnuncio}/>
                    <Route exact path="/ModificaAnnuncio" component={ModificaAnnuncio}/>
                    <Route exact path="/ModificaPassword" component={ModificaPassword} />
                    <Route exact path="/ListaPrenotazioniRicevute" component={ListaPrenotazioniRicevute}/>
                    <Route exact path="/DettagliPrenotazioneRicevuta" component={DettagliPrenotazioneRicevuta}/>
                    <Route exact path="/AnnullaPrenotazioneRicevuta" component={AnnullaPrenotazioneRicevuta}/>
                    <Route exact path="/PrenotazioniEffettuate" component={ListaPrenotazioniEffettuate}/>
                    <Route exact path="/DettagliPrenotazioneEffettuata" component={DettagliPrenotazioneEffettuata}/>
                    <Route exact path="/AnnullaPrenotazioneEffettuata" component={AnnullaPrenotazioneEffettuata}/>
                    <Route exact path="/FinestraPagamento" component={EffettuaPagamento}/>
                    <Route exact path="/DettagliPagamento" component={DettagliPagamento}/>
                    <Route exact path="/GestioneEconomica" component={GestioneEconomica}/>
                    <Route exact path="/RichiestaPrenotazione" component={RichiestaPrenotazione} />
                </BrowserRouter> 
            );   
        
        //Se viene riscontrato un problema con l'id o con l'email mentre un utente è loggato
        //allora viene stampato un errore con la possibilità di effettuare il login
        else {

            //Svuoto la memoria in modo da dare la possibilità di navigare nuovamente
            sessionStorage.clear();
            localStorage.clear();

            corpo = (
                    <div className="container-fluid mt-5 " style={{backgroundImage: 'url(/images/valleDeiTempli.jpg)', backgroundRepeat: "no-repeat" , minHeight: "500px"}}>
                        <div className="container">
                            <h1 className="my-5" style={{color:"white", textShadow:"3px 3px 5px black"}}>Sessione scaduta</h1>
                            <h5 className="my-0" style={{color:"white", textShadow:"3px 3px 5px black"}}>Cause principali:</h5>
                            <p className="my-0" style={{color:"white", textShadow:"3px 3px 5px black"}}> - Sessione aperta da più di quattro ore;</p>
                            <p className="my-0" style={{color:"white", textShadow:"3px 3px 5px black"}}> - Forzato tentativo di modifica della memoria web</p>
                            <br/>
                            <div className="row">
                                <div className="col-md-4">
                                    <h4 className="my-0" style={{color:"white", textShadow:"3px 3px 5px black"}}>Per continuare la normale navigazione nel sito si consiglia di rieffettuare il login.</h4>                                
                                </div>
                            </div>
                        </div>
                    </div>    
                );    
        }
            

        //Stampo il corpo
        return (
            <div>
                <Header />
                    {this.state.stato === 'log' ? <NavbarLogged /> : <NavbarLogin />}
                <div>
                    {corpo}
                </div>
                <Footer /> 
            </div> 
        );
    }
}

export default App;
