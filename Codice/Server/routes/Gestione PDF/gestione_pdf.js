var createError = require('http-errors');
var express = require('express');
var router = express.Router();

const multer = require('multer');
const upload = multer();
const fs = require("fs");

const { config } = require('../../db/config');
const { makeDb, withTransaction } = require('../../db/dbmiddleware');

// La rotta /inserimento_annunci è vietata 
router.get('/', function (req, res, next) {
    next(createError(403));
});

//Gestione pdf
router.post('/carica', upload.any(), caricaPdf);
router.post('/controllo_cartella', controlloCartella);
router.post('/lista', listaPdf);
router.post('/elimina', elimina);
router.post('/id_stanze', trovaIdStanze);

function controlloCartella(req, res, next) {

    if (!fs.existsSync(`./public/pdf/${req.body.tipo}${req.body.id}`))
        fs.mkdirSync(`./public/pdf/${req.body.tipo}${req.body.id}`);

    res.send();
}

function caricaPdf(req, res, next) {

    for (file of req.files) {
        fs.writeFileSync(`./public/pdf/${file.fieldname}/${file.originalname}`, file.buffer);
    }
    res.send();
}

function listaPdf(req, res, next) {

    let files = [];
    if (fs.existsSync(`./public/pdf/${req.body.tipo}${req.body.id}`)) {
        files = fs.readdirSync(`./public/pdf/${req.body.tipo}${req.body.id}`);
    }
    res.send(JSON.stringify(files));
}

function elimina(req, res, next) {

    for (nome of req.body.nomi)
        fs.unlinkSync(`./public/pdf/${req.body.tipo}${req.body.id}/${nome}`);

    res.send();
}

async function trovaIdStanze(req, res, next) {
    const db = await makeDb(config);
    try {

        let results;

        await withTransaction(db, async () => {

            //Cerco i dati utili per dopo
            results = await db.query('SELECT *\
                                        FROM prenotazioni_beb\
                                        WHERE id_prenotazione = ?', req.body.id)

            //Cambio lo stato a tutte le prenotazioni:
            //-dello stesso b&b
            //-con le stesse date di check_in e check_out
            //-dello stesso cliente
            results = await db.query('SELECT id_prenotazione\
                            FROM prenotazioni_beb AS P, stanze_beb AS S\
                            WHERE P.ref_stanza = S.id_stanza AND\
                            P.`ref_annuncio` = ? AND\
                            P.`ref_cliente` = ? AND\
                            P.`check_in` = ? AND\
                            P.`check_out` = ?',
                [
                    [results[0].ref_annuncio],
                    [results[0].ref_cliente],
                    [results[0].check_in],
                    [results[0].check_out]
                ])
                .catch(err => { throw err; });
        });
        //Creo l'oggetto contenente l'id da ritornare
        let str = '';
        for (let val of results) {
            str += ('-' + String(val.id_prenotazione));
        }
        let obj = { id: str }
        res.send(JSON.stringify(obj));
    }
    catch (err) {
        console.log(err);
        next(createError(500));
    }
}

module.exports = router;