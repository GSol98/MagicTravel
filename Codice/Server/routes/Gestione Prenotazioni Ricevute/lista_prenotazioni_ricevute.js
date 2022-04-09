var createError = require('http-errors');
var express = require('express');
var router = express.Router();

const { config } = require('../../db/config');
const { makeDb, withTransaction } = require('../../db/dbmiddleware');

// La rotta /inserimento_annunci è vietata 
router.get('/', function(req, res, next) {
    next(createError(403));
});

//Richiedo tutte le prenotazioni ricevute sugli annunci di tipo casa vacanza
router.post('/casa_vacanze', listaRichiesteCasaVacanze);

//Richiedo tutte le prenotazioni ricevute sugli annunci di tipo b&b
router.post('/beb', listaRichiesteBeb);

//=======================
//Funzioni
//=======================

async function listaRichiesteCasaVacanze(req, res, next) {

    //Creo la connessione con il db
    const db = await makeDb(config);
    try {
        await withTransaction(db, async () => {
            
            //Eseguo la query
            let results = await db.query('SELECT DISTINCT  id_annuncio, id_prenotazione, titolo, nome, cognome, data_richiesta,\
                                         stato, check_in, check_out, numero_partecipanti, gestione_legale, tassa_soggiorno_tot,\
                                         tipo_alloggio\
                                        FROM `annunci_casa_vacanze` AS A, `prenotazioni_casa_vacanze` AS P, \
                                        `utenti` AS U\
                                        WHERE\
                                        A.ref_proprietario = ? AND\
                                        A.id_annuncio = P.ref_annuncio AND\
                                        P.ref_cliente = U.id_utente', [req.body.id])
            .catch(err => { throw err; });

            //Invio dati frontend
            res.send(JSON.stringify(results));
        });
    }
    catch (err) {
        console.log(err);
        next(createError(500));
    }
    
}

async function listaRichiesteBeb(req, res, next) {

    //Creo connessione db
    const db = await makeDb(config);
    try {
        await withTransaction(db, async () => {

            //Eseguo la query
            results = await db.query('SELECT DISTINCT  id_annuncio, id_prenotazione, titolo, nome, cognome, data_richiesta, stato, check_in, \
                                        check_out, numero_partecipanti, gestione_legale, tassa_soggiorno_tot, id_stanza, numero_stanza,\
                                        tipo_alloggio\
                                        FROM `annunci_beb` AS A, `stanze_beb` as S, `prenotazioni_beb` AS P, \
                                        `utenti` AS U\
                                        WHERE\
                                        A.ref_proprietario = ? AND\
                                        A.id_annuncio = S.ref_beb AND\
                                        S.id_stanza = P.ref_stanza AND\
                                        P.ref_cliente = U.id_utente', [req.body.id])
            .catch(err => { throw err; });

            //Invio dati al frontend
            res.send(JSON.stringify(results));
        });
    }
    catch (err) {
        console.log(err);
        next(createError(500));
    }
    
}

module.exports = router;
