var createError = require('http-errors');
var express = require('express');
var router = express.Router();

const { config } = require('../../db/config');
const { makeDb, withTransaction } = require('../../db/dbmiddleware');

//La rotta /Registrazione è stata vietata
router.get('/', function (req, res, next) {
    next(createError(403));
});

router.post('/informazioni_annuncio', recuperoInformazioniAnnuncio);
router.post('/recupero_prenotazioni_beb', recuperoPrenotazioniBeB);
router.post('/recupero_prenotazioni_cv', recuperoPrenotazioniCV)
router.post('/effettua_prenotazione_casa_vacanze', prenotaCV);
router.post('/effettua_prenotazione_beb', prenotaBeb)
router.post('/stanze_annuncio_beb', recuperoStanze);

async function recuperoPrenotazioniBeB(req, res, next) {
    const db = await makeDb(config);
    try {
        await withTransaction(db, async () => {
            let prenotazioni = await db.query('SELECT * \
                                           FROM `prenotazioni_beb` \
                                           WHERE ref_annuncio = ? AND\
                                           stato != "annullata" AND\
                                           stato != "rifiutata"' , Number.parseInt(req.body.idAnnuncio)
            )
                .catch(err => { throw err; });
            res.send(JSON.stringify(prenotazioni))
        });
    }
    catch (err) {
        console.log(err);
        next(createError(500));
    }
}

async function recuperoPrenotazioniCV(req, res, next) {
    const db = await makeDb(config);
    try {
        await withTransaction(db, async () => {
            let prenotazioni = await db.query('SELECT * \
                                        FROM `prenotazioni_casa_vacanze` \
                                        WHERE ref_annuncio = ? AND\
                                                stato != "annullata" AND\
                                                stato != "rifiutata"' , Number.parseInt(req.body.idAnnuncio)
            )
                .catch(err => { throw err; });
            res.send(JSON.stringify(prenotazioni))
        });
    }
    catch (err) {
        console.log(err);
        next(createError(500));
    }
}

async function recuperoInformazioniAnnuncio(req, res, next) {
    const db = await makeDb(config);
    let annuncio = {};
    try {
        await withTransaction(db, async () => {

            //SE IL TIPO DI ANNUNCIO E CASA VACANZE MI RECUPERO LE INFORMAZIONI RELATIVE ALL'ANNUNCIO RECUPER ANCHE COMUNE PROVINCIA E REGIONE
            if (req.body.TipoAnnuncio === "C") {
                annuncio = await db.query('SELECT `annunci_casa_vacanze`.*, `comuni`.nome AS nome_comune, \
                                            `province`.nome AS nome_provincia,`regioni`.nome AS nome_regione  \
                                           FROM `annunci_casa_vacanze`, `comuni`, `province`, `regioni`\
                                           WHERE `annunci_casa_vacanze`.ref_comune = `comuni`.id_comune AND\
                                            `comuni`.ref_provincia = `province`.id_provincia AND `province`.ref_regione = `regioni`.id_regione  AND\
                                             `annunci_casa_vacanze`.id_annuncio = ?', Number.parseInt(req.body.idAnnuncio)
                )
                    .catch(err => { throw err; });
            }
            //SE INVECE E UN BEB MI RECUPERO LE INFORMAZIONI RELATIVE ALL'ANNUNCIO BEB
            else {
                annuncio = await db.query('SELECT `annunci_beb`.*, `comuni`.nome AS nome_comune, `province`.nome AS nome_provincia,\
                                            `regioni`.nome AS nome_regione  \
                                        FROM `annunci_beb`, `comuni`, `province`, `regioni`\
                                        WHERE `annunci_beb`.ref_comune = `comuni`.id_comune AND\
                                         `comuni`.ref_provincia = `province`.id_provincia AND \
                                         `province`.ref_regione = `regioni`.id_regione  AND \
                                         `annunci_beb`.id_annuncio = ?', Number.parseInt(req.body.idAnnuncio)
                )
                    .catch(err => { throw err; });
            }
            res.send(JSON.stringify(annuncio));
        });
    }
    catch (err) {
        console.log(err);
        next(createError(500));
    }
}

async function prenotaCV(req, res, next) {
    const db = await makeDb(config);
    let results = {};
    let inserimentoPersona = {};
    let numeroGiorni = ((new Date(req.body.state.CheckOut) - new Date(req.body.state.CheckIn))) / (60 * 60 * 24 * 1000) + 1;
    let costoTotale = req.body.state.annuncio.costo * numeroGiorni;

    //Se l'utente sceglie di pagare anche le tasse di soggiorno le aggiungiamo al prezzo
    if (req.body.state.paga_tasse)
        costoTotale += req.body.state.annuncio.tassa_soggiorno * req.body.state.NumeroPersone * (numeroGiorni - 1);

    try {
        await withTransaction(db, async () => {
            //AGGIUNGO LA PRENOTAZIONE IN prenotazioni_casa_vacanze
            results = await db.query("INSERT INTO `prenotazioni_casa_vacanze` \
                                    (ref_annuncio , ref_cliente , data_richiesta, check_in, check_out, numero_partecipanti, stato, \
                                    gestione_legale, tassa_soggiorno_tot, prezzo_no_tasse, prezzo_con_tasse) VALUE ?", [
                [
                    [
                        req.body.state.annuncio.id_annuncio,
                        req.body.idUtente,
                        (new Date()).toLocaleDateString(),
                        req.body.state.CheckIn,
                        req.body.state.CheckOut,
                        req.body.state.NumeroPersone,
                        "in attesa",
                        0,
                        0,
                        (req.body.state.annuncio.costo * numeroGiorni),
                        costoTotale
                    ]
                ]
            ]
            )
                .catch(err => { throw err; });

            let id_prenotazione = results.insertId;

            //INSERISCO PER PRIMO L'UTENTE IN prenotazioni_utenti_casa_vacanze
            inserimentoPersona = await db.query("INSERT INTO `prenotazioni_utenti_casa_vacanze` VALUES ?", [
                [
                    [
                        id_prenotazione,
                        req.body.idUtente
                    ]
                ]
            ])
                .catch(err => { throw err; });

            //INSERISCO I VIAGGIATORI IN utenti
            for (var i = 0; i < req.body.state.NumeroPersone - 1; i++) {
                let id_persona;
                inserimentoPersona = await db.query("SELECT * \
                                                     FROM `utenti` \
                                                     WHERE codice_fiscale = ?" , req.body.state.CodiceFiscale[i].toUpperCase())
                    .catch(err => { throw err; });

                //SE LA PERSONA NON E PRESENTE NEL DB LA AGGIUNGO
                if (inserimentoPersona.length === 0) {
                    //Aggiungo la persona al database
                    inserimentoPersona = await db.query("INSERT INTO `utenti` \
                                                        (nome, cognome, data_di_nascita, codice_fiscale, numero_telefono) VALUES ?", [
                        [
                            [
                                req.body.state.Nome[i],
                                req.body.state.Cognome[i],
                                req.body.state.DataDiNascita[i],
                                req.body.state.CodiceFiscale[i].toUpperCase(),
                                req.body.state.NumeroDiTelefono[i],
                            ]
                        ]]
                    )
                        .catch(err => { throw err; });

                    id_persona = inserimentoPersona.insertId;
                }
                //SE LA PERSONA E GIA PRESENTE NON LA AGGIUNGO
                else
                    id_persona = inserimentoPersona[0].id_utente;

                //INSERISCO OGNI PERSONA IN prenotazioni_utenti_casaVacanze
                inserimentoPersone = await db.query("INSERT INTO `prenotazioni_utenti_casa_vacanze` VALUE ?", [
                    [
                        [
                            id_prenotazione,
                            id_persona
                        ]
                    ]
                ])
                    .catch(err => { throw err; });
            }
            res.status(200).send();
        });
    }
    catch (err) {
        console.log(err);
        next(createError(500));
    }
}

async function prenotaBeb(req, res, next) {
    const db = await makeDb(config);
    let results = {};
    let numeroGiorni = (new Date(req.body.state.CheckOut) - new Date(req.body.state.CheckIn)) / (60 * 60 * 24 * 1000) + 1;
    let costoTotale = req.body.state.costoPrenotazioneBeB * numeroGiorni;

    //Se l'utente sceglie di pagare anche le tasse di soggiorno le aggiungiamo al prezzo
    if (req.body.state.paga_tasse)
        costoTotale += req.body.state.annuncio.tassa_soggiorno * req.body.state.NumeroPersone * (numeroGiorni - 1);

    try {
        await withTransaction(db, async () => {

            //Salvo qui dentro gli id delle prenotazioni che rigistro. Utile per poi inserire le tuple in
            //prenotazioni_utenti_beb
            let id_prenotazione = [];
            let inserimentoPersona;
            let index = 0;

            for (let stanza of req.body.state.stanze) {

                //Controllo che la stanza sia stata prenotata
                let continua = false;
                for (let id of req.body.state.idStanzeDaPrenotare)
                    if (id === stanza.id_stanza)
                        continua = true;
                if (!continua)
                    continue;

                //Inserisco la prenotazione della stanza
                results = await db.query("INSERT INTO `prenotazioni_beb` \
                                        (ref_annuncio , ref_stanza, ref_cliente, data_richiesta, check_in, check_out, \
                                        numero_partecipanti, stato, gestione_legale, tassa_soggiorno_tot, prezzo_no_tasse, prezzo_con_tasse) \
                                        VALUES ?" , [
                    [
                        [
                            stanza.ref_beb,
                            stanza.id_stanza,
                            req.body.idUtente,
                            (new Date()).toLocaleDateString(),
                            req.body.state.CheckIn,
                            req.body.state.CheckOut,
                            req.body.state.NumeroPersone,
                            "in attesa",
                            0,
                            0,
                            (req.body.state.costoPrenotazioneBeB * numeroGiorni),
                            costoTotale
                        ]
                    ]
                ]
                )
                    .catch(err => { throw err; });

                //Memorizzo l'id che è stato dato alla prenotazione
                id_prenotazione.push(results.insertId);

                //Inserisco in prenotazioni_utenti_beb solo chi ha prenotato (per il momento)
                inserimentoPersona = await db.query("INSERT INTO `prenotazioni_utenti_beb` VALUE ?", [
                    [
                        [
                            id_prenotazione[index],
                            req.body.idUtente
                        ]
                    ]
                ])
                    .catch(err => { throw err; });
                index++;
            }

            //Inserisco le altre persone
            for (let i = 0; i < req.body.state.NumeroPersone - 1; i++) {

                //Salvo l'id persona per poter aggiungere la tupla in prenotazioni_utenti_beb
                let id_persona;

                //Controllo se la persona è già salvata 
                inserimentoPersona = await db.query("SELECT * \
                                                    FROM `utenti` \
                                                    WHERE codice_fiscale = ?" , req.body.state.CodiceFiscale[i].toUpperCase()
                )
                    .catch(err => { throw err; });

                //se la persone non è presente la aggiungo 
                if (inserimentoPersona.length === 0) {

                    //Aggiungo la persona al database
                    inserimentoPersona = await db.query("INSERT INTO `utenti` \
                                                        (nome, cognome, data_di_nascita, codice_fiscale,numero_telefono) VALUES ?", [
                        [
                            [req.body.state.Nome[i],
                            req.body.state.Cognome[i],
                            req.body.state.DataDiNascita[i],
                            req.body.state.CodiceFiscale[i].toUpperCase(),
                            req.body.state.NumeroDiTelefono[i],
                            ]
                        ]])

                        .catch(err => { throw err; });

                    //Salvo in inserimento persona l'id della persona appena inserita
                    id_persona = inserimentoPersona.insertId;
                }

                //Salvo in id_persona l'id dell'utente già presente nel database
                else
                    id_persona = inserimentoPersona[0].id_utente;

                console.log(id_prenotazione)
                //Inserisco in prenotazioni-utenti-beb la persona per tutte le prenotazioni delle stanze
                for (let j = 0; j < id_prenotazione.length; j++) {

                    inserimentoPersona = await db.query("INSERT INTO `prenotazioni_utenti_beb` VALUE ?", [
                        [
                            [
                                id_prenotazione[j],
                                id_persona
                            ]
                        ]
                    ])
                        .catch(err => { throw err; });
                }
            }
        });
    }
    catch (err) {
        console.log(err);
        next(createError(500));
    }

    console.log("Prenotazione effettuata con successo");
    res.status(200).send();
}

async function recuperoStanze(req, res, next) {
    const db = await makeDb(config);
    try {
        await withTransaction(db, async () => {

            let results = await db.query('SELECT * \
                                    FROM `stanze_beb` AS S \
                                    WHERE S.nascosta = 0 AND S.ref_beb = ?' , req.body.idAnnuncio
            )
                .catch(err => { throw err; });
            res.send(JSON.stringify(results));
        });
    }
    catch (err) {
        console.log(err);
        next(createErrore(500));
    }
}
module.exports = router;
