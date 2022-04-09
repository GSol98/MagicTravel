const createError = require('http-errors');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const fs = require('fs');

const { config } = require('../../db/config');
const { makeDb, withTransaction } = require('../../db/dbmiddleware');

// La rotta /gestione_annunci è vietata 
router.get('/', function (req, res, next) {
    next(createError(403));
});

// Gestione delle rotte
router.post('/nascondi_annuncio', nascondiAnnuncio);
router.post('/mostra_annuncio', rendiVisibileAnnuncio);
router.post('/modifica_annuncio', modificaAnnuncio);
router.post('/modifica_immagine_copertina', upload.any(), modificaImmagineCopertina);
router.post('/modifica_immagini', upload.any(), modificaImmagini);

// Variabili globali
let tipo_alloggio;
let id_annuncio;


// middleware di nascondi annuncio
async function nascondiAnnuncio(req, res, next) {
    const db = await makeDb(config);

    // Recupero dall'url tipo e id dell'annuncio da nascondere
    let nome = req.body.id.substring(0, 1);
    let id = req.body.id.substring(1, req.body.id.length);

    try {
        await withTransaction(db, async () => {

            // CASO CASA VACANZE
            if (nome === "C") {
                await db.query('UPDATE `annunci_casa_vacanze`  \
                                SET nascosto = 1  \
                                WHERE `annunci_casa_vacanze`.id_annuncio = ?', id)
                    .catch(err => { throw err; });
            }
            // CASO B&B
            else {
                await db.query('UPDATE `annunci_beb`  \
                                SET nascosto = 1  \
                                WHERE `annunci_beb`.id_annuncio = ?', id)
                    .catch(err => { throw err; });
            }
        });
        res.send();
    }
    catch (err) {
        console.log(err);
        next(createError(500));
    }
}

// middleware di mostra annuncio
async function rendiVisibileAnnuncio(req, res, next) {
    const db = await makeDb(config);

    // Recupero dall'url tipo e id dell'annuncio da redere visibile
    let nome = req.body.id.substring(0, 1);
    nome = (nome === "C") ? "CasaVacanze" : "B&B"
    let id = req.body.id.substring(1, req.body.id.length);

    try {
        await withTransaction(db, async () => {

            // CASO CASA VACANZE
            if (nome === "CasaVacanze") {
                await db.query('UPDATE `annunci_casa_vacanze`  \
                                SET nascosto = 0  \
                                WHERE `annunci_casa_vacanze`.id_annuncio = ?', id)
                    .catch(err => { throw err; });
            }
            // CASO B&B
            else {
                await db.query('UPDATE `annunci_beb`  \
                                SET nascosto = 0  \
                                WHERE `annunci_beb`.id_annuncio = ?', id)
                    .catch(err => { throw err; });
            }
        });
        res.send();
    }
    catch (err) {
        console.log(err);
        next(createError(500));
    }
}


//      Middleware di modifica annuncio
// La modifica viene gestita con l'eliminazione del vecchio annuncio e con
// l'inserimento del nuovo. Come per la cancellazione impongo che l'annuncio 
// non possa essere modificato se esistono prenotazioni riferite a questo.

async function modificaAnnuncio(req, res, next) {
    const db = await makeDb(config);
    let results = {};

    try {
        await withTransaction(db, async () => {
            console.log(req.body)
            // CASO CASE VACANZA
            if (req.body.nome === "C") {
                // Modifico tutti i campi di annunci_casa_vacanze con i valori inseriti nel form
                await db.query("UPDATE `annunci_casa_vacanze`  \
                                SET titolo = ?, ref_comune = ?, indirizzo = ?, numero_civico = ?, descrizione = ?,  \
                                    dimensione_alloggio = ?, numero_stanze = ?, numero_posti_letto = ?, numero_bagni = ?,  \
                                    wifi = ?, televisore = ?, ascensore = ?, parcheggio = ?, animali = ?, fumatori = ?,  \
                                    ariaCondizionata = ?, riscaldamenti = ?, trasporti = ?, microonde = ?, lavastoviglie = ?,  \
                                    frigorifero = ?, forno = ?, lavabiancheria = ?, asciugatrice = ?, phon = ?, ferroDaStiro = ?,  \
                                    telecamere = ?, estintore = ?, allarmeFurto = ?, allarmeIncendio = ?, costo = ?,  \
                                    tassa_soggiorno = ?, nascosto = ?, data_creazione = ?  \
                                WHERE `annunci_casa_vacanze`.id_annuncio = ?", [
                    req.body.state.titolo,
                    Number.parseInt(req.body.state.id_comune),
                    req.body.state.indirizzo,
                    Number.parseInt(req.body.state.numero_civico),
                    req.body.state.descrizione,
                    Number.parseInt(req.body.state.dimensione_alloggio),
                    Number.parseInt(req.body.state.numero_stanze),
                    Number.parseInt(req.body.state.numero_posti_letto),
                    Number.parseInt(req.body.state.numero_bagni),
                    req.body.serviziAggiuntivi.wifi,
                    req.body.serviziAggiuntivi.televisore,
                    req.body.serviziAggiuntivi.ascensore,
                    req.body.serviziAggiuntivi.parcheggio,
                    req.body.serviziAggiuntivi.animali,
                    req.body.serviziAggiuntivi.fumatori,
                    req.body.serviziAggiuntivi.ariaCondizionata,
                    req.body.serviziAggiuntivi.riscaldamenti,
                    req.body.serviziAggiuntivi.trasporti,
                    req.body.serviziAggiuntivi.microonde,
                    req.body.serviziAggiuntivi.lavastoviglie,
                    req.body.serviziAggiuntivi.frigorifero,
                    req.body.serviziAggiuntivi.forno,
                    req.body.serviziAggiuntivi.lavabiancheria,
                    req.body.serviziAggiuntivi.asciugatrice,
                    req.body.serviziAggiuntivi.phon,
                    req.body.serviziAggiuntivi.ferroDaStiro,
                    req.body.serviziAggiuntivi.telecamere,
                    req.body.serviziAggiuntivi.estintore,
                    req.body.serviziAggiuntivi.allarmeFurto,
                    req.body.serviziAggiuntivi.allarmeIncendio,
                    Number.parseInt(req.body.state.costo),
                    Number.parseInt(req.body.state.tassa_soggiorno),
                    Number.parseInt(req.body.state.nascosto),
                    (new Date()).toLocaleDateString(),
                    Number.parseInt(req.body.id)
                ]
                )
                    .catch(err => { throw err; });
                tipo_alloggio = "CasaVacanze";
                id_annuncio = req.body.id;

                // Elimino le immagini selezionate dall'utente
                req.body.immaginiDaEliminare.forEach(immagine => {
                    fs.unlinkSync(`./public/images/ImmaginiAnnunci/CasaVacanze${req.body.id}/${immagine}`);
                });
            }

            // CASO B&B
            else {
                // Modifico tutti i campi di annunci_casa_vacanze con i valori inseriti nel form
                await db.query("UPDATE `annunci_beb`  \
                                SET titolo = ?, ref_comune = ?, indirizzo = ?, numero_civico = ?, descrizione = ?,  tassa_soggiorno = ?, \
                                    wifi = ?, televisore = ?, ascensore = ?, parcheggio = ?, animali = ?, fumatori = ?,  \
                                    ariaCondizionata = ?, riscaldamenti = ?, trasporti = ?, microonde = ?, lavastoviglie = ?,  \
                                    frigorifero = ?, forno = ?, lavabiancheria = ?, asciugatrice = ?, phon = ?, ferroDaStiro = ?,  \
                                    telecamere = ?, estintore = ?, allarmeFurto = ?, allarmeIncendio = ?, nascosto = ?, data_creazione = ?  \
                                WHERE `annunci_beb`.id_annuncio = ?", [
                    req.body.state.titolo,
                    Number.parseInt(req.body.state.id_comune),
                    req.body.state.indirizzo,
                    Number.parseInt(req.body.state.numero_civico),
                    req.body.state.descrizione,
                    Number.parseInt(req.body.state.tassa_soggiorno),
                    req.body.serviziAggiuntivi.wifi,
                    req.body.serviziAggiuntivi.televisore,
                    req.body.serviziAggiuntivi.ascensore,
                    req.body.serviziAggiuntivi.parcheggio,
                    req.body.serviziAggiuntivi.animali,
                    req.body.serviziAggiuntivi.fumatori,
                    req.body.serviziAggiuntivi.ariaCondizionata,
                    req.body.serviziAggiuntivi.riscaldamenti,
                    req.body.serviziAggiuntivi.trasporti,
                    req.body.serviziAggiuntivi.microonde,
                    req.body.serviziAggiuntivi.lavastoviglie,
                    req.body.serviziAggiuntivi.frigorifero,
                    req.body.serviziAggiuntivi.forno,
                    req.body.serviziAggiuntivi.lavabiancheria,
                    req.body.serviziAggiuntivi.asciugatrice,
                    req.body.serviziAggiuntivi.phon,
                    req.body.serviziAggiuntivi.ferroDaStiro,
                    req.body.serviziAggiuntivi.telecamere,
                    req.body.serviziAggiuntivi.estintore,
                    req.body.serviziAggiuntivi.allarmeFurto,
                    req.body.serviziAggiuntivi.allarmeIncendio,
                    Number.parseInt(req.body.state.nascosto),
                    (new Date()).toLocaleDateString(),
                    Number.parseInt(req.body.id)
                ]
                )
                    .catch(err => { throw err; });
                tipo_alloggio = "B&B";
                id_annuncio = req.body.id;

                // Elimino le immagini selezionate dall'utente
                req.body.immaginiDaEliminare.forEach(immagine => {
                    fs.unlinkSync(`./public/images/ImmaginiAnnunci/B&B${req.body.id}/${immagine}`);
                });

                await db.query('UPDATE `stanze_beb`  \
                                SET nascosta = 1   \
                                WHERE `stanze_beb`.ref_beb = ?', id_annuncio)
                    .catch(err => { throw err; });

                // Inserisco le stanze del B&B
                for (let i = 0, k = 1; i < req.body.state.camere.length; i++) {
                    for (let j = 0; j < Number.parseInt(req.body.state.camere[i]); j++, k++) {
                        await db.query('INSERT INTO `stanze_beb` (ref_beb, numero_posti_letto, prezzo, numero_stanza) VALUE ?', [
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
                console.log("Annuncio Modificato");
            }
            res.send();
        });
    }
    catch (err) {
        console.log(err);
        next(createError(500));
    }
}

// Middleware di modifica dell'immagine di copertina
// viene chiamato solamente se è state inseria una nuova immagine di copertina
function modificaImmagineCopertina(req, res, next) {
    // Sovrascrivo la vecchia imamgine con quella nuova
    fs.writeFileSync(`./public/images/ImmaginiAnnunci/${tipo_alloggio}${id_annuncio}/00copertina.jpeg`, req.files[0].buffer);

    console.log("Copertina Creata");
    res.send();
}

// Inserisco tutte le imamgini nella cartella precedentemente creata
function modificaImmagini(req, res, next) {
    // Inserisco le nuove immagini nella cartella relativa all'annuncio
    req.files.forEach(file => {
        fs.writeFileSync(`./public/images/ImmaginiAnnunci/${tipo_alloggio}${id_annuncio}/${file.originalname}`, file.buffer);
    });

    console.log("Immagini Create");
    res.send();
}

module.exports = router;