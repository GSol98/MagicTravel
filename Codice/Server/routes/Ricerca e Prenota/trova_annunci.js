var createError = require('http-errors');
var express = require('express');
var router = express.Router();
var fs = require('fs');

const { config } = require('../../db/config');
const { makeDb, withTransaction } = require('../../db/dbmiddleware');

// La rotta /trova_annunci è vietata 
router.get('/', function(req, res, next) {
    next(createError(403));
});

router.post('/ricerca_annunci', ricercaAnnunci);
router.post('/recupero_stanze_beb', recuperoStanzeBeB);
router.post('/recupera_annunci' , recuperaAnnuncio);

async function recuperaAnnuncio(req, res, next) {
    const db = await makeDb(config);
    let annuncio = {};

    try {
        if(req.body.nome === "B&B")
        {
            annuncio = await db.query('SELECT `annunci_beb`.*, `comuni`.nome AS nome_comune, `province`.nome AS nome_provincia,  \
                                              `regioni`.nome AS nome_regione  \
                                       FROM `annunci_beb`, `comuni`, `province`, `regioni`  \
                                       WHERE `annunci_beb`.ref_comune = `comuni`.id_comune AND  \
                                             `comuni`.ref_provincia = `province`.id_provincia AND  \
                                             `province`.ref_regione = `regioni`.id_regione  AND  \
                                             `annunci_beb`.id_annuncio = ?', Number.parseInt(req.body.id))
            .catch(err => {throw err; });

            // Recupero le immagini relative ai B&B
            annuncio.forEach(annuncio => {
                if(fs.existsSync(`./public/images/ImmaginiAnnunci/B&B${annuncio.id_annuncio}`))
                    annuncio.immagini = fs.readdirSync(`./public/images/ImmaginiAnnunci/B&B${annuncio.id_annuncio}`);
            });
        }
        else
        {
            annuncio = await db.query('SELECT `annunci_casa_vacanze`.*, `comuni`.nome AS nome_comune, `province`.nome AS nome_provincia,  \
                                              `regioni`.nome AS nome_regione  \
                                       FROM `annunci_casa_vacanze`, `comuni`, `province`, `regioni`  \
                                       WHERE `annunci_casa_vacanze`.ref_comune = `comuni`.id_comune AND  \
                                             `comuni`.ref_provincia = `province`.id_provincia AND  \
                                             `province`.ref_regione = `regioni`.id_regione  AND  \
                                             `annunci_casa_vacanze`.id_annuncio = ?', Number.parseInt(req.body.id))
            .catch(err => {throw err; });
            
            // Recupero le immagini relative agli annunci delle case vacanze
            annuncio.forEach(annuncio => {
                if(fs.existsSync(`./public/images/ImmaginiAnnunci/CasaVacanze${annuncio.id_annuncio}`))
                    annuncio.immagini = fs.readdirSync(`./public/images/ImmaginiAnnunci/CasaVacanze${annuncio.id_annuncio}`);
                });
        }

        res.send(JSON.stringify(annuncio[0]));
    }
    catch(err) {
        console.log(err);
        next(createError(500));
    }
}

// Middleware Recupero stanze B&B
async function recuperoStanzeBeB(req, res, next) {
    const db = await makeDb(config);
    let results = {};

    try {
        await withTransaction(db, async () => {
            results = await db.query('SELECT *\
                                      FROM `stanze_beb` AS S \
                                      WHERE S.nascosta = 0 AND\
                                            S.ref_beb = ?', req.body.id)
            .catch(err => { throw err; });
            res.send(JSON.stringify(results));
        })
    }
    catch (err) {
        console.log(err);
        next(createError(500));
    }
} 


/**         Middleware Ricerca Annunci
 *  Vengono gestiti tutti i possibili filtri inseriti dall'utente:   
 *  */ 

async function ricercaAnnunci(req, res, next) {

    const db = await makeDb(config);
    let annunciC = [];
    let annunciB = [];

    try {

        await withTransaction(db, async () => {

            //Controllo se il filtro per le case vacanza è stato selezionato
            if(req.body.TipoAnnuncio === '' || req.body.TipoAnnuncio === 'CasaVacanze') {

                //Scrivo la query con solo la ricerca della destinazione
                let str = `SELECT * 
                            FROM annunci_casa_vacanze AS A, comuni AS C  
                            WHERE A.nascosto = 0 AND
                                    C.id_comune = A.ref_comune AND
                                    C.nome = "${req.body.Destinazione}"`;

                //Controllo se è stato selezionato il filtro del prezzo
                str += req.body.Prezzo === '' ? '' : ` AND A.costo < ${req.body.Prezzo}`;

                //Controllo se è stato selezionato il filtro del numero di persone
                str += req.body.Persone === '' ? '' : ` AND A.numero_posti_letto >= ${req.body.Persone}`;

                //Controllo se è stato selezionato il filtro del tipo 'altro'
                if(req.body.Altro !== '' ) {

                    //Eseguo lo split per recuperrare i filtri
                    let filtri = req.body.Altro.split(',');
                    for(let filtro of filtri)
                        str += ` AND ${filtro} = 1`;
                }

                //Controllo se è sttao selezionato il filtro per il periodo
                str += req.body.Dal !== '' && req.body.Al !== '' ? ` AND NOT EXISTS (SELECT *
                                                                                    FROM prenotazioni_casa_vacanze AS P
                                                                                    WHERE P.ref_annuncio = A.id_annuncio AND
                                                                                        ((P.check_in BETWEEN '${req.body.Dal}' AND '${req.body.Al}') OR
                                                                                        (P.check_out BETWEEN '${req.body.Dal}' AND '${req.body.Al}') OR
                                                                                        ('${req.body.Dal}' BETWEEN P.check_in AND P.check_out) OR
                                                                                        ('${req.body.Al}' BETWEEN P.check_in AND P.check_out)))` : '';
                annunciC = await db.query(str)
                .catch(err => { throw err; });
            }

            //Controllo se il filtro per i b&b è stato selezionato
            if(req.body.TipoAnnuncio === '' || req.body.TipoAnnuncio === 'BeB') {

                //Scrivo la query con solo la ricerca della destinazione
                let str = `SELECT DISTINCT A.*, S1.prezzo as costo, C.nome
                            FROM annunci_beb AS A, comuni AS C, stanze_beb AS S1 
                            WHERE A.nascosto = 0 AND
                                    C.id_comune = A.ref_comune AND
                                    S1.ref_beb = A.id_annuncio AND
                                    S1.prezzo = (SELECT MIN(S2.prezzo)
                                                FROM stanze_beb AS S2
                                                WHERE S2.ref_beb = A.id_annuncio) AND
                                    C.nome = "${req.body.Destinazione}"`

                //Controllo se è stato selezionato il filtro del prezzo
                str += req.body.Prezzo === '' ? '' : ` AND S1.prezzo < ${req.body.Prezzo}`;

                //Controllo se è stato selezionato il filtro del numero di persone
                str += req.body.Persone === '' ? '' : ` AND S1.numero_posti_letto >= ${req.body.Persone}`;

                //Controllo se è stato selezionato il filtro del tipo 'altro'
                if(req.body.Altro !== '' ) {

                    //Eseguo lo split per recuperrare i filtri
                    let filtri = req.body.Altro.split(',');
                    for(let filtro of filtri)
                        str += ` AND ${filtro} = 1`;
                }
                    

                //Controllo se è sttao selezionato il filtro per il periodo
                str += req.body.Dal !== '' && req.body.Al !== '' ? ` AND NOT EXISTS (SELECT *
                                                                                        FROM prenotazioni_beb AS P, stanze_beb AS S3
                                                                                        WHERE P.ref_stanza = S3.id_stanza AND
                                                                                            S3.ref_beb = A.id_annuncio AND
                                                                                            ((P.check_in BETWEEN '${req.body.Dal}' AND '${req.body.Al}') OR
                                                                                            (P.check_out BETWEEN '${req.body.Dal}' AND '${req.body.Al}') OR
                                                                                            ('${req.body.Dal}' BETWEEN P.check_in AND P.check_out) OR
                                                                                            ('${req.body.Al}' BETWEEN P.check_in AND P.check_out)))` : '';

                annunciB = await db.query(str)
                .catch(err => { throw err; });
            }
        });

        //Unisco i risultati e li ordino per fascia di prezzo
        let risultati = annunciC.concat(annunciB);
        risultati.sort((elem1, elem2) => { return elem1.costo - elem2.costo;} );
        res.send(JSON.stringify(risultati));
    }
    catch (err) {
        console.log(err);
        next(createError(500));
    }
    
}

module.exports = router;
