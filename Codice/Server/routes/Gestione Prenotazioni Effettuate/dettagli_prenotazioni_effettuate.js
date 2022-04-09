var createError = require('http-errors');
var express = require('express');
var router = express.Router();

const { config } = require('../../db/config');
const { makeDb, withTransaction } = require('../../db/dbmiddleware');
const nodemailer = require("nodemailer");

// La rotta /dettagli_prenotazioni_effettuate è vietata 
router.get('/', function (req, res, next) {
    next(createError(403));
});


//Gestione dettagli richiesta
router.post('/dettagli_richiesta/casa_vacanze', dettagliCasaVacanze);
router.post('/dettagli_richiesta/beb', dettagliBeb);

//Gestione utenti partecipanti ad una richiesta
router.post('/dati_clienti/casa_vacanze', personeCasaVacanze);
router.post('/dati_clienti/beb', personeBeb);

async function dettagliCasaVacanze(req, res, next) {
    const db = await makeDb(config);

    try {
        await withTransaction(db, async () => {

            let results = await db.query('SELECT  P.*, A.*, PR.nome AS nomeProvincia, R.nome AS nomeRegione, C.nome AS nomeComune\
                                          FROM `annunci_casa_vacanze` AS A, `prenotazioni_casa_vacanze` AS P, `comuni` AS C, `province` AS PR, `regioni` AS R\
                                          WHERE P.id_prenotazione = ? AND\
                                                P.ref_annuncio = A.id_annuncio AND\
                                                A.ref_comune = C.id_comune AND\
                                                C.ref_provincia = PR.id_provincia AND\
                                                PR.ref_regione = R.id_regione', req.body.id)
                .catch(err => { throw err; });
            res.send(JSON.stringify(results));
        });
    }
    catch (err) {
        console.log(err);
        next(createError(500));
    }

}

async function dettagliBeb(req, res, next) {
    const db = await makeDb(config);

    try {
        await withTransaction(db, async () => {

            let results = await db.query('SELECT DISTINCT  P.*, A.*, PR.nome AS nomeProvincia, R.nome AS nomeRegione, C.nome AS nomeComune, S.numero_posti_letto AS posti_letto, S.numero_stanza, S.prezzo\
                                        FROM `annunci_beb` AS A, `prenotazioni_beb` AS P, `comuni` AS C, `province` AS PR, `regioni` AS R, `stanze_beb` AS S\
                                        WHERE P.id_prenotazione = ? AND\
                                              P.ref_annuncio = A.id_annuncio AND\
                                              A.ref_comune = C.id_comune AND\
                                              C.ref_provincia = PR.id_provincia AND\
                                              PR.ref_regione = R.id_regione AND\
                                              P.ref_stanza = S.id_stanza', req.body.id)
                .catch(err => { throw err; });
            res.send(JSON.stringify(results));
        });
    }
    catch (err) {
        console.log(err);
        next(createError(500));
    }

}

async function personeCasaVacanze(req, res, next) {
    const db = await makeDb(config);
    try {
        await withTransaction(db, async () => {

            let results = await db.query('SELECT DISTINCT  *\
                                        FROM `prenotazioni_utenti_casa_vacanze` AS P, `utenti` AS U\
                                        WHERE P.ref_id_prenotazione = ? AND\
                                              P.ref_id_persona = U.id_utente', req.body.id)
                .catch(err => { throw err; });
            res.send(JSON.stringify(results));
        });
    }
    catch (err) {
        console.log(err);
        next(createError(500));
    }

}

async function personeBeb(req, res, next) {
    const db = await makeDb(config);
    try {
        await withTransaction(db, async () => {

            let results = await db.query('SELECT DISTINCT  *\
                                          FROM `prenotazioni_utenti_beb` AS P, `utenti` AS U\
                                          WHERE P.ref_id_prenotazione = ? AND\
                                              P.ref_id_persona = U.id_utente', req.body.id)
                .catch(err => { throw err; });
            res.send(JSON.stringify(results));
        });
    }
    catch (err) {
        console.log(err);
        next(createError(500));
    }

}

module.exports = router;