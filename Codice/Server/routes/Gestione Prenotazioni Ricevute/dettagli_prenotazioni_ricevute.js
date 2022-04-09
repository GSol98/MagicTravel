var createError = require('http-errors');
var express = require('express');
var router = express.Router();

const fs = require("fs");

const { config } = require('../../db/config');
const { makeDb, withTransaction } = require('../../db/dbmiddleware');
const nodemailer = require("nodemailer");

// La rotta /inserimento_annunci è vietata 
router.get('/', function(req, res, next) {
    next(createError(403));
});

//Cambiare stato
router.post('/casa_vacanza/cambia_stato', cambiaStatoCasaVacanza);
router.post('/beb/cambia_stato', cambiaStatoBeb);

//Gestione dettagli richiesta
router.post('/dettagli_richiesta/casa_vacanze', dettagliCasaVacanze);
router.post('/dettagli_richiesta/beb', dettagliBeb);

//Gestione utenti partecipanti ad una richiesta
router.post('/dati_clienti/casa_vacanze', personeCasaVacanze);
router.post('/dati_clienti/beb', personeBeb);

//Pagamento tassa di soggiorno
router.post('/tassa_soggiorno/casa_vacanze', tassaSoggiornoCasaVacanze);
router.post('/tassa_soggiorno/beb', tassaSoggiornoBeb);

//Invio dati questura
router.post('/gestione_legale/casa_vacanze', gestioneLegaleCasaVacanze);
router.post('/gestione_legale/beb', gestioneLegaleBeb);

//Annulla prenotazione ricevuta
router.post('/annulla_prenotazione/casa_vacanze', annullaCasaVacanze);
router.post('/annulla_prenotazione/beb', annullaBeb);

async function dettagliCasaVacanze(req, res, next) {
    const db = await makeDb(config);
    try {
        await withTransaction(db, async () => {
            
            let results = await db.query('SELECT DISTINCT  *\
                                        FROM `annunci_casa_vacanze` AS A, `prenotazioni_casa_vacanze` AS P, `comuni` AS C \
                                        WHERE\
                                        P.id_prenotazione = ? AND\
                                        A.id_annuncio = P.ref_annuncio AND \
                                        A.ref_comune = C.id_comune', [req.body.id])
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
            
            let results = await db.query('SELECT DISTINCT  *\
                                        FROM `annunci_beb` AS A, `prenotazioni_beb` AS P, `stanze_beb` AS S,\
                                        `comuni` AS C\
                                        WHERE\
                                        P.id_prenotazione = ? AND\
                                        S.id_stanza = P.ref_stanza AND \
                                        S.ref_beb = A.id_annuncio AND\
                                        A.ref_comune = C.id_comune', [req.body.id])
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
                                        WHERE\
                                        P.ref_id_prenotazione = ? AND\
                                        P.ref_id_persona = U.id_utente', [req.body.id])
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
                                        WHERE\
                                        P.ref_id_prenotazione = ? AND\
                                        P.ref_id_persona = U.id_utente', [req.body.id])
            .catch(err => { throw err; });

            res.send(JSON.stringify(results));
        });
    }
    catch (err) {
        console.log(err);
        next(createError(500));
    }
    
}

async function cambiaStatoCasaVacanza(req, res, next) {
    const db = await makeDb(config);
    try {
        await withTransaction(db, async () => {
            
            await db.query(`UPDATE prenotazioni_casa_vacanze SET stato = ? ${req.body.stato === 'accettata' ? `, data_accettazione = "${(new  Date()).toLocaleDateString()}"` : ''}
                            WHERE prenotazioni_casa_vacanze.id_prenotazione = ?`, [req.body.stato, req.body.id])
            .catch(err => { throw err; });
        });
        res.send();
    }
    catch (err) {
        console.log(err);
        next(createError(500));
    }
    
}

async function cambiaStatoBeb(req, res, next) {
    const db = await makeDb(config);
    try {
        await withTransaction(db, async () => {
            
            //Cambio lo stato a tutte le prenotazioni:
            //-dello stesso b&b
            //-con le stesse date di check_in e check_out
            //-dello stesso cliente
            await db.query(`UPDATE prenotazioni_beb SET stato = ? ${req.body.stato === 'accettata' ? `, data_accettazione = "${(new  Date()).toLocaleDateString()}"` : ''}
                            WHERE prenotazioni_beb.ref_annuncio = ? AND
                            prenotazioni_beb.ref_cliente = ? AND
                            prenotazioni_beb.check_in = ? AND
                            prenotazioni_beb.check_out = ?`, 
                                        [
                                            [req.body.stato], 
                                            [req.body.dettagli.ref_annuncio],
                                            [req.body.dettagli.ref_cliente],
                                            [req.body.dettagli.check_in],
                                            [req.body.dettagli.check_out]
                                        ]
            )
            .catch(err => { throw err; });
        });
        res.send();
    }
    catch (err) {
        console.log(err);
        next(createError(500));
    }
    
}

async function tassaSoggiornoCasaVacanze(req, res, next) {
    const db = await makeDb(config);
    let email;

    //Calcolo le tasse da pagare
    let giorniPernottamento = Math.floor((new Date(req.body.dettagli.check_out) - new Date(req.body.dettagli.check_in))/(1000*60*60*24));
    let costoTasse = req.body.dettagli.tassa_soggiorno*req.body.dettagli.numero_partecipanti*giorniPernottamento;

    try {
        await withTransaction(db, async () => {

            let oggi = new Date();

            //Aggiungo la transazione del pagamento
            await db.query('INSERT INTO `transazioni_casa_vacanze` (`ref_utente`, `ref_prenotazione`, `data`, `importo`, descrizione) VALUES ?', [
                        [
                            [
                                req.body.dettagli.ref_proprietario, 
                                req.body.dettagli.id_prenotazione,
                                oggi.toLocaleDateString(), 
                                (-1)*costoTasse,
                                "Tasse di soggiorno"
                            ]
                        ]
                ]
            )
            .catch(err => { throw err; });

            //Se il proprietario paga le tasse di soggiorno e il cliente non le aveva ancora pagate 
            //vuol dire che il pagamento è avvenuto di presenza. Per tenere traccia di ciò modifico
            //le transazioni precedenti
            if(req.body.dettagli.prezzo_no_tasse === req.body.dettagli.prezzo_con_tasse) {

                //Transazione proprietario
                await db.query("UPDATE `transazioni_casa_vacanze` SET `importo` = ? \
                                WHERE `transazioni_casa_vacanze`.`ref_utente` = ? AND \
                                    `transazioni_casa_vacanze`.`ref_prenotazione` = ? AND\
                                    `transazioni_casa_vacanze`.`importo` = ?", 
                                    [
                                        [costoTasse + req.body.dettagli.prezzo_no_tasse], 
                                        [req.body.dettagli.ref_proprietario],
                                        [req.body.dettagli.id_prenotazione],
                                        [req.body.dettagli.prezzo_no_tasse]
                                    ]
                )
                .catch(err => { throw err; });    

                //Transazione cliente
                await db.query("UPDATE `transazioni_casa_vacanze` SET `importo` = ? \
                                WHERE `transazioni_casa_vacanze`.`ref_utente` = ? AND \
                                    `transazioni_casa_vacanze`.`ref_prenotazione` = ? AND\
                                    `transazioni_casa_vacanze`.`importo` = ?", 
                                    [
                                        [-1*(costoTasse + req.body.dettagli.prezzo_no_tasse)], 
                                        [req.body.dettagli.ref_cliente],
                                        [req.body.dettagli.id_prenotazione],
                                        [-1*req.body.dettagli.prezzo_no_tasse]
                                    ]
                )
                .catch(err => { throw err; });   
            }

            //Salvo il prezzo pagato dal proprietario per la tassa di soggiorno
            await db.query('UPDATE `prenotazioni_casa_vacanze` SET tassa_soggiorno_tot = ?\
                            WHERE `prenotazioni_casa_vacanze`.id_prenotazione = ?', [ [costoTasse], [req.body.dettagli.id_prenotazione]])
            .catch(err => { throw err; });

           //In questo caso l'email da inviare alla questura viene inoltrata al proprietario
            //dell'annuncio per motivi didattici
            email = await db.query(`SELECT email
                                    FROM account as A
                                    WHERE A.id_account = ?`, req.body.dettagli.ref_proprietario); 
        });

        //Creo il messaggio da inviare
        let messaggio = "<div><h1>Dati clienti<h1>";

        for(let cliente of req.body.datiClienti) {
            messaggio += `<h5>${cliente.nome} ${cliente.cognome}</h5>
                            <p>Data di nascita: ${cliente.data_di_nascita}</p>
                            <p>Codice fiscale: ${cliente.codice_fiscale}</p>
                            <p>Numero di telefono: ${cliente.numero_telefono}</p>`;
        }

        messaggio += `<br/>
                        <p>Periodo permanenza: dal ${req.body.dettagli.check_in} al ${req.body.dettagli.check_out}</p>
                        <p>Costo tasse di soggiorno: ${costoTasse} €</p>
                    </div>`;

        sendEmail(email[0].email, messaggio, 'Informazioni trimestrali', []);
        res.send();
    }
    catch (err) {
        console.log(err);
        next(createError(500));
    }
}

async function tassaSoggiornoBeb(req, res, next) {

    const db = await makeDb(config);
    let email;

    //Calcolo le tasse da pagare
    let giorniPernottamento = Math.floor((new Date(req.body.dettagli.check_out) - new Date(req.body.dettagli.check_in))/(1000*60*60*24));
    let costoTasse = req.body.dettagli.tassa_soggiorno*req.body.dettagli.numero_partecipanti*giorniPernottamento;
    
    try {
        await withTransaction(db, async () => {

            let oggi = new Date();

            //Aggiungo la transazione del pagamento
            await db.query('INSERT INTO `transazioni_beb` (`ref_utente`, `ref_prenotazione`, `data`, `importo`, descrizione) VALUES ?', [
                        [
                            [
                                req.body.dettagli.ref_proprietario, 
                                req.body.dettagli.id_prenotazione,
                                oggi.toLocaleDateString(), 
                                (-1)*costoTasse,
                                "Tasse di soggiorno"
                            ]
                        ]
                ]
            )
            .catch(err => { throw err; });

            //Se il proprietario paga le tasse di soggiorno e il cliente non le aveva ancora pagate 
            //vuol dire che il pagamento è avvenuto di presenza. Per tenere traccia di ciò modifico
            //le transazioni precedenti
            if(req.body.dettagli.prezzo_no_tasse === req.body.dettagli.prezzo_con_tasse) {

                //Transazione proprietario
                await db.query("UPDATE `transazioni_beb` SET `importo` = ? \
                                WHERE `transazioni_beb`.`ref_utente` = ? AND \
                                    `transazioni_beb`.`ref_prenotazione` = ? AND\
                                    `transazioni_beb`.`importo` = ?", 
                                    [
                                        [costoTasse + req.body.prezzo_no_tasse], 
                                        [req.body.dettagli.ref_proprietario],
                                        [req.body.dettagli.id_prenotazione],
                                        [req.body.dettagli.prezzo_no_tasse]
                                    ]
                )
                .catch(err => { throw err; });    

                //Transazione cliente
                await db.query("UPDATE `transazioni_beb` SET `importo` = ? \
                                WHERE `transazioni_beb`.`ref_utente` = ? AND \
                                    `transazioni_beb`.`ref_prenotazione` = ? AND\
                                    `transazioni_beb`.`importo` = ?", 
                                    [
                                        [-1*(costoTasse + req.body.prezzo)], 
                                        [req.body.dettagli.ref_cliente],
                                        [req.body.dettagli.id_prenotazione],
                                        [-1*req.body.dettagli.prezzo_no_tasse]
                                    ]
                )
                .catch(err => { throw err; });   
            }

            //Cambio lo stato a tutte le prenotazioni:
            //-dello stesso b&b
            //-con le stesse date di check_in e check_out
            //-dello stesso cliente
            await db.query('UPDATE `prenotazioni_beb` SET `tassa_soggiorno_tot` = ?\
                            WHERE `prenotazioni_beb`.`ref_annuncio` = ? AND\
                            `prenotazioni_beb`.`ref_cliente` = ? AND\
                            `prenotazioni_beb`.`check_in` = ? AND\
                            `prenotazioni_beb`.`check_out` = ?', 
                                        [
                                            [costoTasse], 
                                            [req.body.dettagli.ref_annuncio],
                                            [req.body.dettagli.ref_cliente],
                                            [req.body.dettagli.check_in],
                                            [req.body.dettagli.check_out]
                                        ])
            .catch(err => { throw err; });

            //In questo caso l'email da inviare alla questura viene inoltrata al proprietario
            //dell'annuncio per motivi didattici
            email = await db.query(`SELECT email
                                    FROM account as A
                                    WHERE A.id_account = ?`, req.body.dettagli.ref_proprietario);
        });

        //Creo il messaggio da inviare
        let messaggio = "<div><h1>Dati clienti<h1>";

        for(let cliente of req.body.datiClienti) {
            messaggio += `<h5>${cliente.nome} ${cliente.cognome}</h5>
                            <p>Data di nascita: ${cliente.data_di_nascita}</p>
                            <p>Codice fiscale: ${cliente.codice_fiscale}</p>
                            <p>Numero di telefono: ${cliente.numero_telefono}</p>`;
        }

        messaggio += `<br/>
                        <p>Periodo permanenza: dal ${req.body.dettagli.check_in} al ${req.body.dettagli.check_out}</p>
                        <p>Costo tasse di soggiorno: ${costoTasse} €</p>
                    </div>`;

        sendEmail(email[0].email, messaggio, 'Informazioni trimestrali', []);

        res.send();
    }
    catch (err) {
        console.log(err);
        next(createError(500));
    }
}

async function gestioneLegaleCasaVacanze(req, res, next) {

    const db = await makeDb(config);
    try {
        let email;

        //Creo il messaggio da inviare
        let messaggio = "<div><h1>Dati clienti<h1>";

        for(let cliente of req.body.datiClienti) {
            messaggio += `<h5>${cliente.nome} ${cliente.cognome}</h5>
                            <p>Data di nascita: ${cliente.data_di_nascita}</p>
                            <p>Codice fiscale: ${cliente.codice_fiscale}</p>
                            <p>Numero di telefono: ${cliente.numero_telefono}</p>`;
        }

        messaggio += "</div>";

        //Creo l'array che conterrà gli allegati
        let obj = [];

        //Cerco gli allegati
        let files = fs.readdirSync(`./public/pdf/C${req.body.id_prenotazione}`);

        //Salvo i file in oggetti che inserisco in obj
        for(let file of files) {
            obj.push({
                filename: file,
                path: `./public/pdf/C${req.body.id_prenotazione}/${file}`,
                contentType: 'application/pdf'
            });       
        }     
        
        await withTransaction(db, async () => {
            
            //Imposto nel db che i dati sono stati inviati alla questura
            await db.query('UPDATE `prenotazioni_casa_vacanze` SET `gestione_legale` = ?\
                            WHERE `prenotazioni_casa_vacanze`.`id_prenotazione` = ?', [[1], [req.body.id_prenotazione]])
            .catch(err => { throw err; });

            //In questo caso l'email da inviare alla questura viene inoltrata al proprietario
            //dell'annuncio per motivi didattici
            email = await db.query(`SELECT email
                                    FROM account as A
                                    WHERE A.id_account = ?`, req.body.ref_proprietario);
        });

        //Invio email
        sendEmail(email[0].email, messaggio, 'Inoltro dati', obj); 

        res.send();
    }
    catch (err) {
        console.log(err);
        next(createError(500));
    }
}

async function gestioneLegaleBeb(req, res, next) {

    const db = await makeDb(config);
    let results;
    let email;

    try {
        await withTransaction(db, async () => {   

             results = await db.query('SELECT id_prenotazione\
                                        FROM prenotazioni_beb AS P, stanze_beb AS S\
                                        WHERE P.ref_stanza = S.id_stanza AND\
                                        P.`ref_annuncio` = ? AND\
                                        P.`ref_cliente` = ? AND\
                                        P.`check_in` = ? AND\
                                        P.`check_out` = ?', 
                                    [
                                        [req.body.dettagli.ref_annuncio],
                                        [req.body.dettagli.ref_cliente],
                                        [req.body.dettagli.check_in],
                                        [req.body.dettagli.check_out]
                                    ])
            .catch(err => { throw err; });

            //Cambio gestione_legale a tutte le prenotazioni:
            //-dello stesso b&b
            //-con le stesse date di check_in e check_out
            //-dello stesso cliente
            await db.query('UPDATE `prenotazioni_beb` SET `gestione_legale` = 1\
                            WHERE `prenotazioni_beb`.`ref_annuncio` = ? AND\
                            `prenotazioni_beb`.`ref_cliente` = ? AND\
                            `prenotazioni_beb`.`check_in` = ? AND\
                            `prenotazioni_beb`.`check_out` = ?', 
                                        [
                                            [req.body.dettagli.ref_annuncio],
                                            [req.body.dettagli.ref_cliente],
                                            [req.body.dettagli.check_in],
                                            [req.body.dettagli.check_out]
                                        ])
            .catch(err => { throw err; }); 

            //In questo caso l'email da inviare alla questura viene inoltrata al proprietario
            //dell'annuncio per motivi didattici
            email = await db.query(`SELECT email
                                    FROM account as A
                                    WHERE A.id_account = ?`, req.body.dettagli.ref_proprietario);
        });

        //Creo il messaggio da inviare
        let messaggio = "<div><h1>Dati clienti<h1>";

        for(let cliente of req.body.datiClienti) {
            messaggio += `<h5>${cliente.nome} ${cliente.cognome}</h5>
                            <p>Data di nascita: ${cliente.data_di_nascita}</p>
                            <p>Codice fiscale: ${cliente.codice_fiscale}</p>
                            <p>Numero di telefono: ${cliente.numero_telefono}</p>`;
        }

        messaggio += "</div>";

        //Creo l'array che conterrà gli allegati
        let obj = [];

        //Genero il nome della cartella dove trovo gli allegati
        let str = '';
        for(let val of results) {
            str += ('-' + String(val.id_prenotazione));
        }

        //Cerco gli allegati
        let files = fs.readdirSync(`./public/pdf/B${str}`);

        //Salvo i file in oggetti che inserisco in obj
        for(let file of files) {
            obj.push({
                filename: file,
                path: `./public/pdf/B${str}/${file}`,
                contentType: 'application/pdf'
            });       
        }     
            
        //Invio email
        sendEmail(email[0].email, messaggio, 'Inoltro dati', obj);

        res.send();
    }
    catch (err) {
        console.log(err);
        next(createError(500));
    }
}

async function annullaCasaVacanze(req, res, next) {
    const db = await makeDb(config);
    let email = [];
    try {
        await withTransaction(db, async () => {
        
            await db.query('UPDATE `prenotazioni_casa_vacanze` SET `stato` = "annullata"\
                            WHERE `prenotazioni_casa_vacanze`.`id_prenotazione` = ?', [req.body.dettagli.id_prenotazione])
            .catch(err => { throw err; });

            if(req.body.dettagli.stato === 'pagata') {
                let oggi = new Date();

                await db.query('INSERT INTO transazioni_casa_vacanze (ref_utente, data, importo, ref_prenotazione , descrizione) VALUES\
                                ?', [
                                    [
                                        [req.body.dettagli.ref_cliente, oggi.toLocaleDateString(), 
                                         req.body.dettagli.prezzo_no_tasse, 
                                         req.body.dettagli.id_prenotazione,
                                        "Rimborso prenotazione"
                                        ]
                                    ]
                                ])
                .catch(err => { throw err; });

                await db.query('INSERT INTO transazioni_casa_vacanze (ref_utente, data, importo, ref_prenotazione ,descrizione) VALUES\
                                ?', [
                                    [
                                        [req.body.dettagli.ref_proprietario, oggi.toLocaleDateString(),
                                         (-1)*req.body.dettagli.prezzo_no_tasse, 
                                         req.body.dettagli.id_prenotazione,
                                        "Rimborso prenotazione"
                                    ]
                                    ]
                                ])
                .catch(err => { throw err; });
            }

            email = await db.query ('SELECT email\
                                        FROM prenotazioni_casa_vacanze AS P, \
                                            utenti AS U,\
                                            account AS A\
                                        WHERE P.ref_cliente = U.id_utente AND\
                                            U.id_utente = A.id_account AND\
                                            P.id_prenotazione = ?', [req.body.dettagli.id_prenotazione])
            .catch(err => {throw err;}) 
        });   

        let messaggio = `
                        <h1>Prenotazione annullata</h1>
                        <br/>
                        <p>Si comunica che la sua prenotazione riguardo l\'annuncio ${req.body.dettagli.titolo}\</p>
                        <p>riguardante il pregiodo ${req.body.dettagli.check_in} - ${req.body.dettagli.check_out}</p>
                        <p>è stata annullata.</p>
                        <br/>
                        ${(req.body.motivo !== '' ) ? '<p>Motivazioni:</p>' : ''}
                        ${req.body.motivo}
                        <br/>
                        <p>Per maggiori informazioni contattare il proprietario.</p>`

        sendEmail(email[0].email, messaggio, 'Prenotazione ANNULLATA', []);

        res.send();
    }
    catch (err) {
        console.log(err);
        next(createError(500));
    }
}

async function annullaBeb(req, res, next) {
    const db = await makeDb(config);
    let email = [];
    try {
        await withTransaction(db, async () => {
        
            //Cambio lo stato a tutte le prenotazioni:
            //-dello stesso b&b
            //-con le stesse date di check_in e check_out
            //-dello stesso cliente
            await db.query('UPDATE `prenotazioni_beb` SET `stato` = "annullata"\
                            WHERE `prenotazioni_beb`.`ref_annuncio` = ? AND\
                            `prenotazioni_beb`.`ref_cliente` = ? AND\
                            `prenotazioni_beb`.`check_in` = ? AND\
                            `prenotazioni_beb`.`check_out` = ?', 
                                        [
                                            [req.body.dettagli.ref_annuncio],
                                            [req.body.dettagli.ref_cliente],
                                            [req.body.dettagli.check_in],
                                            [req.body.dettagli.check_out]
                                        ])
            .catch(err => { throw err; });

            if(req.body.dettagli.stato === 'pagata') {
                let oggi = new Date();

                await db.query('INSERT INTO transazioni_beb (ref_utente, data, importo, ref_prenotazione, descrizione) VALUES\
                                ?', [
                                    [
                                        [req.body.dettagli.ref_cliente, oggi.toLocaleDateString(),
                                         req.body.dettagli.prezzo_no_tasse, 
                                         req.body.dettagli.id_prenotazione,
                                         "Rimborso prenotazione"
                                        ]
                                    ]
                                ])
                .catch(err => { throw err; });

                await db.query('INSERT INTO transazioni_beb (ref_utente, data, importo, ref_prenotazione, descrizione) VALUES\
                                ?', [
                                    [
                                        [req.body.dettagli.ref_proprietario, 
                                         oggi.toLocaleDateString(), 
                                         (-1)*req.body.dettagli.prezzo_no_tasse, 
                                         req.body.dettagli.id_prenotazione,
                                         "Rimborso prenotazione"
                                        ]
                                    ]
                                ])
                .catch(err => { throw err; });
            }

            email = await db.query ('SELECT email\
                                        FROM prenotazioni_beb AS P, \
                                            utenti AS U,\
                                            account AS A\
                                        WHERE P.ref_cliente = U.id_utente AND\
                                            U.id_utente = A.id_account AND\
                                            P.id_prenotazione = ?', [req.body.dettagli.id_prenotazione])
            .catch(err => {throw err;}) 
        });   

        let messaggio = `
                        <h1>Prenotazione annullata</h1>
                        <br/>
                        <p>Si comunica che la sua prenotazione riguardo l\'annuncio ${req.body.dettagli.titolo}\</p>
                        <p>riguardante il pregiodo ${req.body.dettagli.check_in} - ${req.body.dettagli.check_out}</p>
                        <p>è stata annullata.</p>
                        <br/>
                        ${(req.body.motivo !== '' ) ? '<p>Motivazioni:</p>' : ''}
                        ${req.body.motivo}
                        <br/>
                        <p>Per maggiori informazioni contattare il proprietario.</p>`

        sendEmail(email[0].email, messaggio, 'Prenotazione Annullata', []);

        res.send();
    }
    catch (err) {
        console.log(err);
        next(createError(500));
    }
}



const sendEmail = (email, messaggio, subject, allegati) => {

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
        subject: subject, 
        html: output,
        attachments: allegati
    };

    transporter.sendMail(mailOptions, (err, data) => {
        if(err) {
            console.log(err);
        }
        console.log("Email Sent");
    });
}

module.exports = router;
