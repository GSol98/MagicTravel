const createError = require('http-errors');
const express = require('express');
const router = express.Router();

const fs = require('fs');
const crypto = require("crypto-js");

const { config } = require('../../db/config');
const { makeDb, withTransaction } = require('../../db/dbmiddleware');

// La rotta /Autenticazione è vietata 
router.get('/', function(req, res, next) {
    next(createError(403));
});

// Gestione delle rotte
router.post('/login', login);
router.post('/controllo', controllo);

async function login(req, res, next) {
    const db = await makeDb(config);
    let results = [];
    try {
        await withTransaction(db, async () => { 
            
            results = await db.query(`SELECT id_account, email, nome, cognome
                                          FROM account AS A, utenti AS U
                                          WHERE A.email = ? AND 
                                          A.password = SHA2(?, 512) AND
                                          A.id_account = U.id_utente`, 
                                        [
                                            [req.body.state.Email], [req.body.state.Password]
                                        ])
            .catch(err => {throw err; });

            if(results.length !== 0) {
                let id = crypto.AES.encrypt(String(results[0].id_account) , req.body.state.Email)
                fs.writeFileSync('./public/session/sessione.log', `${id}----${req.body.state.Email}----${(new Date()).toLocaleString()}\n`, {flag: 'a'});
                results[0].id_account = `${id}`;    
            }
        })
        res.send(JSON.stringify(results));
    } 
    catch (err) {
        next(createError(500));
    }
}

function controllo(req, res, next) {

    //Carico il contenuto del file log
    let sessione = fs.readFileSync('./public/session/sessione.log', {encoding: 'utf8'});

    //Eseguo lo split per riprendere tutti gli id e le email per controllare se
    //l'utente ha effettuato il login.
    //Questo server per prevenire eventuali cambi manuali da frontend dell'id
    let trova = false;
    let id = [];
    sessione.split('\n').forEach((elem, index) => {

        //Se trovo sia l'id che l'email allora vuol dire che l'utente ha valori
        //validi memorizzati nel sessionStorage
        if(elem.split('----')[0] === req.body.id && elem.split('----')[1] === req.body.email)
            trova = true;
        
        //Se trovo delle righe inserite da più di 4 ore le rimuovo
        //Questo evita l'accumulo infinito di codici
        if(new Date() - new Date(elem.split('----')[2]) > 4*60*60*1000) 
            id.push(index);

    });

    //Controllo se ci sono id da eliminare
    if(id.length !== 0) {

        //In caso riscrivo il file sessione eliminando gli id nell'array id
        let str = '';
        sessione.split('\n').forEach((elem, index) => {
            if(elem !== '' && (id.length === 0 || index !== id[0]))
                str += elem + '\n';
            else
                id.shift();
        });

        fs.writeFileSync('./public/session/sessione.log', str);
    }
    
    //Se trovo l'id ritorno 'log' altrimenti 'problem'
    if(trova)
        res.send(JSON.stringify({messaggio: 'log'}));
    else
        res.send(JSON.stringify({messaggio: 'problem'}))
}

module.exports = router;
