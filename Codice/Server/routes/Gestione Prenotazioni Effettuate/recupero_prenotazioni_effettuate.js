var createError = require('http-errors');
var express = require('express');
var router = express.Router();

const { config } = require('../../db/config');
const { makeDb, withTransaction } = require('../../db/dbmiddleware');

// La rotta /recupera_prenotazioni_effettuate è vietata 
router.get('/', function(req, res, next) {
    next(createError(403));
});

router.post('/casa_vacanze', listaPrenotazioniCasaVacanze);
router.post('/beb', listaPrenotazioniBeb);

async function listaPrenotazioniCasaVacanze(req, res, next) {
    const db = await makeDb(config);
    try {
        await withTransaction(db, async () => {
            
            let results = await db.query('SELECT DISTINCT P.id_prenotazione, A.titolo, P.data_richiesta, P.stato, P.check_in,  \
                                                          P.ref_annuncio, P.check_out, P.numero_partecipanti, P.prezzo_no_tasse, P.prezzo_con_tasse,  \
                                                          A.tassa_soggiorno, tipo_alloggio  \
                                          FROM `annunci_casa_vacanze` AS A, `prenotazioni_casa_vacanze` AS P \
                                          WHERE P.ref_cliente = ? AND\
                                                A.id_annuncio = P.ref_annuncio', req.body.id)
                                            
            .catch(err => { throw err; });
            res.send(JSON.stringify(results));
        });
    }
    catch (err) {
        console.log(err);
        next(createError(500));
    }
    
}

async function listaPrenotazioniBeb(req, res, next) {
    const db = await makeDb(config);
    try {
        await withTransaction(db, async () => {

            results = await db.query('SELECT DISTINCT P.id_prenotazione, A.titolo, P.data_richiesta, P.stato, P.check_in,  \
                                                      P.ref_annuncio, P.check_out, P.numero_partecipanti, P.prezzo_no_tasse, P.prezzo_con_tasse, S.numero_stanza,\
                                                      A.tassa_soggiorno, tipo_alloggio  \
                                      FROM `annunci_beb` AS A, `prenotazioni_beb` AS P, `stanze_beb` AS S \
                                      WHERE P.ref_cliente = ? AND\
                                            P.ref_stanza = S.id_stanza AND\
                                            A.id_annuncio = P.ref_annuncio', req.body.id)
                                                                        
                            
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