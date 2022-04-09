var createError = require('http-errors');
var express = require('express');
var router = express.Router();
var fs = require("fs");

const { config } = require('../../db/config');
const { makeDb, withTransaction } = require('../../db/dbmiddleware');

// La rotta /recupero_annunci è vietata 
router.get('/', function (req, res, next) {
    next(createError(403));
});

// Gestione rotte
router.post('/recupera_annunci', recuperaListaAnnunci);
router.post('/recupera_stanze_beb', recuperaStanzeBeB);


/** 
 *      Middleware di Recupero degli Annunci
 *  Il middleware viene utilizzato per reucperare gli annunci di B&B o Case Vacanzerelativi ad un proprietario 
 * */
async function recuperaListaAnnunci(req, res, next) {
    const db = await makeDb(config);
    let results = [];       // Contiene gli annunci relativi a Case Vacanze e B&B
    let resultsCV = {};     // Contiene gli annunci relativi alle case vacanze
    let resultsBeB = {};    // Contiene gli annunci relativi ai B&B

    try {
        await withTransaction(db, async () => {

            // Recupero informazioni annunci Case Vacanze
            resultsCV = await db.query('SELECT DISTINCT `annunci_casa_vacanze`.*, `comuni`.id_comune, `comuni`.nome AS nome_comune, \
                                                        `province`.id_provincia, `province`.nome AS nome_provincia,   \
                                                        `regioni`.id_regione, `regioni`.nome AS nome_regione  \
                                        FROM `annunci_casa_vacanze`, `comuni`, `province`, `regioni`  \
                                        WHERE `annunci_casa_vacanze`.ref_proprietario = ? AND  \
                                            `annunci_casa_vacanze`.ref_comune = `comuni`.id_comune AND  \
                                            `comuni`.ref_provincia = `province`.id_provincia AND  \
                                            `province`.ref_regione = `regioni`.id_regione', Number.parseInt(req.body.id_proprietario))
                .catch(err => { throw err; });

            // Recuper informazioni annunci B&B
            resultsBeB = await db.query('SELECT DISTINCT `annunci_beb`.*, `comuni`.id_comune, `comuni`.nome AS nome_comune,  \
                                                         `province`.id_provincia, `province`.nome AS nome_provincia,  \
                                                         `regioni`.id_regione, `regioni`.nome AS nome_regione  \
                                         FROM `annunci_beb`, `stanze_beb`, `comuni`, `province`, `regioni`  \
                                         WHERE `annunci_beb`.ref_proprietario = ? AND  \
                                               `annunci_beb`.ref_comune = `comuni`.id_comune AND  \
                                               `comuni`.ref_provincia = `province`.id_provincia AND  \
                                               `province`.ref_regione = `regioni`.id_regione', Number.parseInt(req.body.id_proprietario))
                .catch(err => { throw err; });

            // Recupero le immagini relative agli annunci delle case vacanze
            resultsCV.forEach(annuncio => {
                if (fs.existsSync(`./public/images/ImmaginiAnnunci/CasaVacanze${annuncio.id_annuncio}`))
                    annuncio.immagini = fs.readdirSync(`./public/images/ImmaginiAnnunci/CasaVacanze${annuncio.id_annuncio}`);
            });

            // Recupero le immagini relative ai B&B
            resultsBeB.forEach(annuncio => {
                if (fs.existsSync(`./public/images/ImmaginiAnnunci/B&B${annuncio.id_annuncio}`))
                    annuncio.immagini = fs.readdirSync(`./public/images/ImmaginiAnnunci/B&B${annuncio.id_annuncio}`);
            });

            results.push(resultsCV);
            results.push(resultsBeB);
            res.send(JSON.stringify(results));
        });
    }
    catch (err) {
        console.log(err);
        next(createError(500));
    }
}

// Middleware di recupero stanze associate ad un B&B
async function recuperaStanzeBeB(req, res, next) {
    const db = await makeDb(config);
    results = {};

    try {
        await withTransaction(db, async () => {

            // Recupero le stanze associate all'annuncio di un B&B del proprietario
            results = await db.query('SELECT `annunci_beb`.id_annuncio, `stanze_beb`.*  \
                                      FROM `annunci_beb`, `stanze_beb`  \
                                      WHERE `annunci_beb`.ref_proprietario = ? AND  \
                                            `annunci_beb`.id_annuncio = `stanze_beb`.ref_beb AND  \
                                            `stanze_beb`.nascosta = 0', Number.parseInt(req.body.id_proprietario))
                .catch(err => { throw err; });

            console.log("Stanze B&B recuperate");
            res.send(JSON.stringify(results));
        })
    }
    catch (err) {
        console.log(err);
        next(createError(500));
    }
}

module.exports = router;