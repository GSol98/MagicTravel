const createError = require('http-errors');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const fs = require("fs");

const { config } = require('../../db/config');
const { makeDb, withTransaction } = require('../../db/dbmiddleware');

// La rotta /inserimento_annunci è vietata 
router.get('/', function (req, res, next) {
    next(createError(403));
});


// Gestione delle rotte
router.post('/crea_annuncio_casa_vacanze', creaAnnuncioCasaVacanze);
router.post('/crea_annuncio_beb', creaAnnuncioBeB);
router.post('/inserimento_immagine_copertina', upload.any(), inserisciImmagineCopertina)
router.post('/inserimento_immagini', upload.any(), inserisciImmagini);

// Variabili globali
let id_annuncio;
let tipo_alloggio;

// middleware di creazione annuncio casa vacanze
async function creaAnnuncioCasaVacanze(req, res, next) {
    const db = await makeDb(config);
    let results = {};
    try {
        await withTransaction(db, async () => {

            // Inserimento casa vacanza
            results = await db.query("INSERT INTO `annunci_casa_vacanze` (tipo_alloggio, ref_proprietario, titolo, ref_comune, indirizzo, numero_civico, \
                                      descrizione, dimensione_alloggio, numero_stanze, numero_posti_letto, numero_bagni, wifi, televisore, \
                                      ascensore, parcheggio, animali, fumatori, ariaCondizionata, riscaldamenti, trasporti, microonde, \
                                      lavastoviglie, frigorifero, forno, lavabiancheria, asciugatrice, phon, ferroDaStiro, telecamere, \
                                      estintore, allarmeFurto, allarmeIncendio, costo, tassa_soggiorno, data_creazione) VALUE ?", [
                [
                    [
                        req.body.state.tipo_alloggio,
                        Number.parseInt(req.body.id_proprietario),
                        req.body.state.titolo,
                        Number.parseInt(req.body.state.id_comune),
                        req.body.state.indirizzo,
                        Number.parseInt(req.body.state.numero_civico),
                        req.body.state.descrizione,
                        Number.parseInt(req.body.state.dimensione_alloggio),
                        Number.parseInt(req.body.state.numero_stanze),
                        Number.parseInt(req.body.state.numero_posti_letto),
                        Number.parseInt(req.body.state.numero_bagni),
                        req.body.state.wifi,
                        req.body.state.televisore,
                        req.body.state.ascensore,
                        req.body.state.parcheggio,
                        req.body.state.animali,
                        req.body.state.fumatori,
                        req.body.state.ariaCondizionata,
                        req.body.state.riscaldamenti,
                        req.body.state.trasporti,
                        req.body.state.microonde,
                        req.body.state.lavastoviglie,
                        req.body.state.frigorifero,
                        req.body.state.forno,
                        req.body.state.lavabiancheria,
                        req.body.state.asciugatrice,
                        req.body.state.phon,
                        req.body.state.ferroDaStiro,
                        req.body.state.telecamere,
                        req.body.state.estintore,
                        req.body.state.allarmeFurto,
                        req.body.state.allarmeIncendio,
                        Number.parseInt(req.body.state.costo),
                        Number.parseInt(req.body.state.tassa_soggiorno),
                        (new Date()).toLocaleString()
                    ]
                ]
            ])
                .catch(err => { throw err; });

            console.log("Annuncio casa vacanze inserito");
            id_annuncio = results.insertId;
            tipo_alloggio = "CasaVacanze";
            res.send();
        });
    }
    catch (err) {
        console.log(err);
        next(createError(500));
    }
}


// middleware di creazione annuncio B&B
async function creaAnnuncioBeB(req, res, next) {
    const db = await makeDb(config);
    let results = {};

    try {
        await withTransaction(db, async () => {
            // Inserimento B&B
            results = await db.query("INSERT INTO `annunci_beb` (tipo_alloggio, ref_proprietario, titolo, ref_comune, indirizzo, numero_civico, descrizione, \
                                      wifi, televisore, ascensore, parcheggio, animali, fumatori, ariaCondizionata, riscaldamenti, trasporti,  \
                                      microonde, lavastoviglie, frigorifero, forno, lavabiancheria, asciugatrice, phon, ferroDaStiro, telecamere, \
                                      estintore, allarmeFurto, allarmeIncendio, tassa_soggiorno, data_creazione) VALUE ?", [
                [
                    [
                        req.body.state.tipo_alloggio,
                        Number.parseInt(req.body.id_proprietario),
                        req.body.state.titolo,
                        Number.parseInt(req.body.state.id_comune),
                        req.body.state.indirizzo,
                        Number.parseInt(req.body.state.numero_civico),
                        req.body.state.descrizione,
                        req.body.state.wifi,
                        req.body.state.televisore,
                        req.body.state.ascensore,
                        req.body.state.parcheggio,
                        req.body.state.animali,
                        req.body.state.fumatori,
                        req.body.state.ariaCondizionata,
                        req.body.state.riscaldamenti,
                        req.body.state.trasporti,
                        req.body.state.microonde,
                        req.body.state.lavastoviglie,
                        req.body.state.frigorifero,
                        req.body.state.forno,
                        req.body.state.lavabiancheria,
                        req.body.state.asciugatrice,
                        req.body.state.phon,
                        req.body.state.ferroDaStiro,
                        req.body.state.telecamere,
                        req.body.state.estintore,
                        req.body.state.allarmeFurto,
                        req.body.state.allarmeIncendio,
                        Number.parseInt(req.body.state.tassa_soggiorno),
                        (new Date()).toLocaleString()
                    ]
                ]
            ]);
            console.log("Annuncio B&B inserito");
            id_annuncio = results.insertId;
            tipo_alloggio = "B&B";

            // Inserisco le stanze del B&B
            for (let i = 0, k = 1; i < req.body.state.camere.length; i++) {
                for (let j = 0; j < Number.parseInt(req.body.state.camere[i]); j++, k++) {
                    results = await db.query('INSERT INTO `stanze_beb` (ref_beb, numero_posti_letto, prezzo, numero_stanza) VALUE ?', [
                        [
                            [
                                Number.parseInt(id_annuncio),
                                Number.parseInt(req.body.state.postiLetto[i]),
                                Number.parseInt(req.body.state.prezzo[i]),
                                k
                            ]
                        ]
                    ]);
                }
            }
            console.log("Stanze B&B inserite");
            res.send();
        });
    }
    catch (err) {
        console.log(err);
        next(createError(500));
    }
}

// Gestisco l'inserimento dell'immagine di copertina
function inserisciImmagineCopertina(req, res, next) {
    // Se non esiste creo la cartella ImmaginiAnnunci nel server
    if (!fs.existsSync(`./public/images/ImmaginiAnnunci`))
        fs.mkdirSync(`./public/images/ImmaginiAnnunci`);

    // Se non esiste una nuova cartella in cui inserire le imamgini relative all'annuncio
    if (!fs.existsSync(`./public/images/ImmaginiAnnunci/${tipo_alloggio}${id_annuncio}`))
        fs.mkdirSync(`./public/images/ImmaginiAnnunci/${tipo_alloggio}${id_annuncio}`);


    // Creo l'immagine di copertina dentro la cartella precedentemente creata
    fs.writeFileSync(`./public/images/ImmaginiAnnunci/${tipo_alloggio}${id_annuncio}/00copertina.jpeg`, req.files[0].buffer);

    console.log("Copertina Creata");
    res.send();
}

// Inserisco tutte le imamgini nella cartella precedentemente creata
function inserisciImmagini(req, res, next) {
    // Creo le immagini nella cartella relativa all'annuncio
    req.files.forEach(file => {
        fs.writeFileSync(`./public/images/ImmaginiAnnunci/${tipo_alloggio}${id_annuncio}/${file.originalname}`, file.buffer);
    });

    console.log("Immagini Create");
    res.send();
}

module.exports = router;