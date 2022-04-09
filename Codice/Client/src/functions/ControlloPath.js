// Controllo della correttezza del path in base allo stato dell'utente (log/no log)
// Viene gestita la protezione delle rotte
const ControlloPath = (location, stato) => {
    const pathCorrettiLogin = [
        "/",
        "/VisualizzaAnnunciRicerca",
        "/DettagliAnnuncioRicerca",
        "/DettagliAnnuncio",
        "/Registrazione",
        "/Login",
        "/ReimpostaPassword",
    ];

    const pathCorrettiLogged = [
        "/",
        "/VisualizzaAnnunciRicerca",
        "/DettagliAnnuncioRicerca",
        "/CreaAnnuncio",
        "/VisualizzaListaAnnunci",
        "/DettagliAnnuncio",
        "/ModificaAnnuncio",
        "/ListaPrenotazioniRicevute",
        "/DettagliPrenotazioneRicevuta",
        "/AnnullaPrenotazioneRicevuta",
        "/TassaDiSoggiornoPrenotazioneRicevuta",
        "/ModificaPassword",
        "/PrenotazioniEffettuate",
        "/DettagliPrenotazioneEffettuata",
        "/AnnullaPrenotazioneEffettuata",
        "/FinestraPagamento",
        "/DettagliPagamento",
        "/RichiestaPrenotazione",
        "/GestioneEconomica"
    ];

   
    //Se lo stato è problem restituisco true in modo da saltare la stampa della pagina 404
    if(stato === 'problem')
        return true;

    //Se lo stato è noLog (utente non loggato) 
    else if(stato === 'noLog') {

        //Prima controllo tra i path login
        let trovato = pathCorrettiLogin.find(path => location === path);
        if(trovato)
            return true;

        //Poi controllo nei path logged
        trovato = pathCorrettiLogged.find(path => location === path);
        if(trovato) {
            window.location.href = '/Login';
            return true;
        }
    }
    
    //Se lo stato è log (loggato) 
    else if(stato === 'log') {

        //Prima controllo tra i path loggati
        let trovato = pathCorrettiLogged.find(path => location === path);
        if(trovato)
            return true;

        //Poi tra i path login
        trovato = pathCorrettiLogin.find(path => location === path);
        if(trovato){
            window.location.href = '/';
            return true;
        }
    }
    return false;
}

export default ControlloPath;
