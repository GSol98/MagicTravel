function ControlloServizioAggiuntivo(servizio)
{
    let serviziAggiuntivi = [
        "wifi",
        "televisore",
        "ascensore",
        "parcheggio",
        "animali",
        "fumatori",
        "ariaCondizionata",
        "riscaldamenti",
        "trasporti",
        "microonde",
        "lavastoviglie",
        "frigorifero",
        "forno",
        "lavabiancheria",
        "asciugatrice",
        "phon",
        "ferroDaStiro",
        "telecamere",
        "estintore",
        "allarmeFurto",
        "allarmeIncendio"
    ];

    for(let serv of serviziAggiuntivi)
    {
        if(serv === servizio)
            return true;
    };
    return false;
}

export default ControlloServizioAggiuntivo;