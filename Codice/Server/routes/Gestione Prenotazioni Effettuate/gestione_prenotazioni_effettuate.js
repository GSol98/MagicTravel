var createError = require('http-errors');
var express = require('express');
var router = express.Router();

const { config } = require('../../db/config');
const { makeDb, withTransaction } = require('../../db/dbmiddleware');
const nodemailer = require("nodemailer");

// La rotta /gestione_prenotazioni_effettuate è vietata 
router.get('/', function (req, res, next) {
    next(createError(403));
});

//Pagamento 
router.post('/pagamento/casa_vacanze', pagamentoCasaVacanze);
router.post('/pagamento/beb', pagamentoBeb);

//Dettagli pagamento 
router.post('/dettagli_pagamento/casa_vacanze', dettagliPagamentoCasaVacanze);
router.post('/dettagli_pagamento/beb', dettagliPagamentoBeb);

//Rimborso pagamento
router.post('/rimborso_pagamento/casa_vacanze', rimborsoCasaVacanze);
router.post('/rimborso_pagamento/beb', rimborsoBeb);

//Annulla prenotazione effettuata
router.post('/annulla_prenotazione/casa_vacanze', annullaCasaVacanze);
router.post('/annulla_prenotazione/beb', annullaBeb);

async function pagamentoCasaVacanze(req, res, next) {
    const db = await makeDb(config);

    try {
        await withTransaction(db, async () => {
            await db.query('UPDATE `prenotazioni_casa_vacanze` SET `stato` = "pagata"\
                            WHERE `prenotazioni_casa_vacanze`.id_prenotazione = ?', [req.body.dettagli.id_prenotazione])
                .catch(err => { throw err; });

            let data = new Date();

            await db.query('INSERT INTO `transazioni_casa_vacanze` (ref_utente, ref_prenotazione, data, importo, descrizione) VALUE ?',
                [[[req.body.dettagli.ref_cliente, req.body.dettagli.id_prenotazione, data.toLocaleDateString(), -req.body.dettagli.prezzo_con_tasse, "Pagamento effettuato"]]])
                .catch(err => { throw err; });


            await db.query('INSERT INTO `transazioni_casa_vacanze` (ref_utente, ref_prenotazione, data, importo, descrizione) VALUE ?',
                [[[req.body.dettagli.ref_proprietario, req.body.dettagli.id_prenotazione, data.toLocaleDateString(), req.body.dettagli.prezzo_con_tasse, "Pagamento ricevuto"]]])

                .catch(err => { throw err; });

        });

        res.send();
    }
    catch (err) {
        console.log(err);
        next(createError(500));
    }
}

async function pagamentoBeb(req, res, next) {
    const db = await makeDb(config);
    try {
        await withTransaction(db, async () => {

            //Cambio lo stato a tutte le prenotazioni:
            //-dello stesso b&b
            //-con le stesse date di check_in e check_out
            //-dello stesso cliente
            await db.query('UPDATE `prenotazioni_beb` SET `stato` = "pagata"\
                            WHERE `prenotazioni_beb`.ref_annuncio = ? AND\
                            `prenotazioni_beb`.ref_cliente = ? AND\
                            `prenotazioni_beb`.check_in = ? AND\
                            `prenotazioni_beb`.check_out = ? AND\
                            `prenotazioni_beb`.data_accettazione = ?',
                [
                    [req.body.dettagli.ref_annuncio],
                    [req.body.dettagli.ref_cliente],
                    [req.body.dettagli.check_in],
                    [req.body.dettagli.check_out],
                    [req.body.dettagli.data_accettazione]
                ])
                .catch(err => { throw err; });

            let data = new Date();

            //Inserisco la transazione dell'utente
            await db.query('INSERT INTO `transazioni_beb` (ref_utente, ref_prenotazione, data, importo, descrizione) VALUES ?',
                [[[req.body.dettagli.ref_cliente, req.body.dettagli.id_prenotazione, data.toLocaleDateString(), -req.body.dettagli.prezzo_con_tasse, "Pagamento effettuato"]]])
                .catch(err => { throw err; });


            //Inserisco la transazione del proprietario
            await db.query('INSERT INTO `transazioni_beb` (ref_utente, ref_prenotazione, data, importo, descrizione) VALUES ?',
                [[[req.body.dettagli.ref_proprietario, req.body.dettagli.id_prenotazione, data.toLocaleDateString(), req.body.dettagli.prezzo_con_tasse, "Pagamento ricevuto"]]])

                .catch(err => { throw err; });

        });

        res.send();
    }
    catch (err) {
        console.log(err);
        next(createError(500));
    }
}

async function dettagliPagamentoCasaVacanze(req, res, next) {
    const db = await makeDb(config);
    try {
        await withTransaction(db, async () => {

            let results = await db.query('SELECT `transazioni_casa_vacanze`.data, `transazioni_casa_vacanze`.importo\
                                          FROM `transazioni_casa_vacanze`\
                                          WHERE `transazioni_casa_vacanze`.ref_prenotazione = ? AND \
                                                `transazioni_casa_vacanze`.ref_utente = ? ',
                [[req.body.id_prenotazione], [req.body.id]])
                .catch(err => { throw err; });
            console.log(results);
            res.send(JSON.stringify(results));
        });
    }
    catch (err) {
        console.log(err);
        next(createError(500));
    }
}

async function dettagliPagamentoBeb(req, res, next) {
    const db = await makeDb(config);
    let prenotazione;
    try {
        await withTransaction(db, async () => {
            prenotazione = await db.query('SELECT *\
                                          FROM `prenotazioni_beb` \
                                          WHERE `prenotazioni_beb`.id_prenotazione = ?', req.body.id_prenotazione)

            let results = await db.query('SELECT `transazioni_beb`.data, `transazioni_beb`.importo\
                                          FROM `transazioni_beb`\
                                          WHERE `transazioni_beb`.ref_prenotazione = ? AND \
                                                `transazioni_beb`.ref_utente = ? ',
                [[req.body.id_prenotazione], [req.body.id]])
                .catch(err => { throw err; });

            if (results.length === 0) {
                results = await db.query('SELECT `transazioni_beb`.*\
                                          FROM `transazioni_beb`\
                                          WHERE `transazioni_beb`.ref_prenotazione IN ( SELECT id_prenotazione\
                                                                                        FROM `prenotazioni_beb`\
                                                                                        WHERE `prenotazioni_beb`.ref_annuncio = ? AND\
                                                                                              `prenotazioni_beb`.ref_cliente = ? AND\
                                                                                              `prenotazioni_beb`.check_in = ? AND\
                                                                                              `prenotazioni_beb`.check_out = ? AND\
                                                                                              `prenotazioni_beb`.data_accettazione = ? )',
                    [
                        [prenotazione[0].ref_annuncio],
                        [prenotazione[0].ref_cliente],
                        [prenotazione[0].check_in],
                        [prenotazione[0].check_out],
                        [prenotazione[0].data_accettazione]
                    ])

            }

            res.send(JSON.stringify(results));

        });
    }
    catch (err) {
        console.log(err);
        next(createError(500));
    }

}

async function rimborsoCasaVacanze(req, res, next) {
    const db = await makeDb(config);

    try {
        await withTransaction(db, async () => {

            let data = new Date();

            await db.query('INSERT INTO `transazioni_casa_vacanze` (ref_utente, ref_prenotazione, data, importo, descrizione) VALUES ?',
                [[[req.body.dettagli.ref_cliente, req.body.dettagli.id_prenotazione, data.toLocaleDateString(), req.body.dettagli.prezzo_no_tasse, "Rimborso prenotazione annullata"]]])
                .catch(err => { throw err; });

            await db.query('INSERT INTO `transazioni_casa_vacanze` (ref_utente, ref_prenotazione, data, importo, descrizione) VALUES ?',
                [[[req.body.dettagli.ref_proprietario, req.body.dettagli.id_prenotazione, data.toLocaleDateString(), (-1) * req.body.dettagli.prezzo_no_tasse, "Rimborso"]]])

                .catch(err => { throw err; });

        });
        res.send();
    }
    catch (err) {
        console.log(err);
        next(createError(500));
    }
}

async function rimborsoBeb(req, res, next) {
    const db = await makeDb(config);

    try {
        await withTransaction(db, async () => {

            let data = new Date();

            await db.query('INSERT INTO `transazioni_beb` (ref_utente, ref_prenotazione, data, importo, descrizione) VALUES ?',
                [[[req.body.dettagli.ref_cliente, req.body.dettagli.id_prenotazione, data.toLocaleDateString(), req.body.dettagli.prezzo_no_tasse, "Rimborso prenotazione annullata"]]])
                .catch(err => { throw err; });

            await db.query('INSERT INTO `transazioni_beb` (ref_utente, ref_prenotazione, data, importo, descrizione) VALUES ?',
                [[[req.body.dettagli.ref_proprietario, req.body.dettagli.id_prenotazione, data.toLocaleDateString(), (-1) * req.body.dettagli.prezzo_no_tasse, "Rimborso"]]])

                .catch(err => { throw err; });



        });
        res.send();
    }
    catch (err) {
        console.log(err);
        next(createError(500));
    }
}

async function annullaCasaVacanze(req, res, next) {
    const db = await makeDb(config);
    try {
        await withTransaction(db, async () => {

            await db.query('UPDATE `prenotazioni_casa_vacanze` SET `stato` = "annullata"\
                            WHERE `prenotazioni_casa_vacanze`.id_prenotazione = ?', [req.body.dettagli.id_prenotazione])
                .catch(err => { throw err; });

            let results = await db.query('SELECT DISTINCT nome, cognome, email, titolo, check_in, check_out \
                                            FROM `annunci_casa_vacanze` AS AN, `prenotazioni_casa_vacanze` AS P, `utenti` AS U, `account` AS A\
                                            WHERE AN.id_annuncio = P.ref_annuncio AND\
                                                AN.ref_proprietario = U.id_utente AND\
                                                U.id_utente = A.id_account AND\
                                                P.id_prenotazione = ?', [req.body.dettagli.id_prenotazione])
                .catch(err => { throw err; });

            let motivazione = req.body.motivo;

            let messaggio = `\
                                <h1>Prenotazione annullata</h1>\
                                <br/>\
                                <p>Sig. ${results[0].nome} ${results[0].cognome}, le comunichiamo che la prenotazione riguardante l'annuncio "${results[0].titolo}",
                                nel periodo che va dal ${results[0].check_in} al ${results[0].check_out}, è stata annullata dal cliente.</p>\
                                <p>Motivazione: <p/>\
                                ${motivazione}
                                <br/>\
                                <p>Per maggiori informazioni contattare il cliente.</p>`

            sendEmail(results[0].email, messaggio);
        });
        res.send();
    }
    catch (err) {
        console.log(err);
        next(createError(500));
    }
}

async function annullaBeb(req, res, next) {
    const db = await makeDb(config);
    let results = [];
    try {
        await withTransaction(db, async () => {

            //Cambio lo stato a tutte le prenotazioni:
            //-dello stesso b&b
            //-con le stesse date di check_in e check_out
            //-dello stesso cliente
            await db.query('UPDATE `prenotazioni_beb` SET `stato` = "annullata"\
                            WHERE `prenotazioni_beb`.ref_annuncio = ? AND\
                            `prenotazioni_beb`.ref_cliente = ? AND\
                            `prenotazioni_beb`.check_in = ? AND\
                            `prenotazioni_beb`.check_out = ? ',
                [
                    [req.body.dettagli.ref_annuncio],
                    [req.body.dettagli.ref_cliente],
                    [req.body.dettagli.check_in],
                    [req.body.dettagli.check_out]
                ])
                .catch(err => { throw err; });

            results = await db.query('SELECT DISTINCT nome, cognome, email, titolo, check_in, check_out \
                                          FROM `annunci_beb` AS AN, `prenotazioni_beb` AS P, `utenti` AS U, `account` AS A\
                                          WHERE AN.id_annuncio = P.ref_annuncio AND\
                                                AN.ref_proprietario = U.id_utente AND\
                                                U.id_utente = A.id_account AND\
                                                P.id_prenotazione = ?', [req.body.dettagli.id_prenotazione])
                .catch(err => { throw err; });


            let motivazione = req.body.motivo;

            let messaggio = `\
                            <h1>Prenotazione annullata</h1>\
                            <br/>\
                            <p>Sig. ${results[0].nome} ${results[0].cognome}, le comunichiamo che la prenotazione riguardante l'annuncio "${results[0].titolo}",
                            nel periodo che va dal ${results[0].check_in} al ${results[0].check_out}, è stata annullata dal cliente.</p>\
                            <p>Motivazione: <p/>\
                            ${motivazione}
                            <br/>\
                            <p>Per maggiori informazioni contattare il cliente.</p>`

            sendEmail(results[0].email, messaggio);
        });
        res.send();
    }
    catch (err) {
        console.log(err);
        next(createError(500));
    }
}

const sendEmail = (email, messaggio) => {

    let output = messaggio;

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "magicTravel.SSTZ@gmail.com",
            pass: "SSTZ2020",
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let mailOptions = {
        from: '"Magic Travel" <magicTravel.SSTZ@gmail.com>',
        to: email,
        subject: "Prenotazione Annullata",
        html: output
    };

    transporter.sendMail(mailOptions, err => {
        if (err) {
            console.log(err);
        }
        console.log("Email Sent");
    });
}

module.exports = router;