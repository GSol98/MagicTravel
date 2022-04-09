var createError = require('http-errors');
var express = require('express');
var router = express.Router();

const { config } = require('../../db/config');
const { makeDb, withTransaction } = require('../../db/dbmiddleware');

// La rotta /gestione_economica è vietata 
router.get('/', function(req, res, next) {
    next(createError(403));
});

//transazioni da proprietario
router.post('/casa_vacanze', listaTransazioniCasaVacanze);
router.post('/beb', listaTransazioniBeb);


async function listaTransazioniCasaVacanze(req, res, next) {
    
    const db = await makeDb(config);
    try {
        await withTransaction(db, async () => {
            
            let results = await db.query('SELECT DISTINCT  A.titolo, A.tipo_alloggio, T.*\
                                          FROM `annunci_casa_vacanze` AS A, `transazioni_casa_vacanze` AS T, `prenotazioni_casa_vacanze` AS P\
                                          WHERE T.ref_utente = ? AND\
                                                T.ref_prenotazione = P.id_prenotazione AND\
                                                P.ref_annuncio = A.id_annuncio', req.body.id)
                                            
            .catch(err => { throw err; });
            
            res.send(JSON.stringify(results));
        });
    }
    catch (err) {
        console.log(err);
        next(createError(500));
    }
    
}

async function listaTransazioniBeb(req, res, next) {
    
    const db = await makeDb(config);
    try {
        await withTransaction(db, async () => {
            
            let results = await db.query('SELECT DISTINCT  A.titolo, A.tipo_alloggio, T.*\
                                          FROM `annunci_beb` AS A, `transazioni_beb` AS T, `prenotazioni_beb` AS P\
                                          WHERE T.ref_utente = ? AND\
                                                T.ref_prenotazione = P.id_prenotazione AND\
                                                P.ref_annuncio = A.id_annuncio', req.body.id)
                 
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