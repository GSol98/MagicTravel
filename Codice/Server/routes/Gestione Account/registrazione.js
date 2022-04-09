var createError = require('http-errors');
var express = require('express');
var router = express.Router();

const crypto = require("crypto");
const nodemailer = require("nodemailer");

const { config } = require('../../db/config');
const { makeDb, withTransaction } = require('../../db/dbmiddleware');

//La rotta /Registrazione è stata vietata
router.get('/', function (req, res, next) {
    next(createError(403));
});

//Nuovo Utente
router.post('/nuovo_utente', inserimentoNuovoUtente);

//middleware inserimentoNuovoUtente
async function inserimentoNuovoUtente(req, res, next) {


    let hash = crypto.createHash('sha512');
    hash.update(req.body.state.Password);
    let pass_encrypted = hash.digest('hex');

    const db = await makeDb(config);
    let results = {};

    try {
        let stato;
        await withTransaction(db, async () => {
            results = await db.query("SELECT * FROM `account` WHERE email = ?", req.body.state.Email);

            //Se esiste già un account relativo a quella password 
            if (Object.keys(results).length !== 0)
                stato = 500;

            else {
                results = await db.query("SELECT * FROM `utenti` WHERE codice_fiscale = ?", req.body.state.CodiceFiscale.toUpperCase());

                //Se la persona era già presente nel database creo solo l'account
                if (Object.keys(results).length !== 0) {
                    let idAccount = results[0].id_utente;

                    //Inserimento Account
                    results = await db.query("INSERT INTO `account` (id_account , email , password) VALUES ?", [
                        [
                            [
                                idAccount,
                                req.body.state.Email,
                                pass_encrypted
                            ]
                        ]
                    ])
                        .catch(err => { throw err; });
                    stato = 200;
                }

                //Altrimenti creo sia la persona(utente) che l'account
                else {
                    //Inserimento nuova Persona

                    results = await db.query("INSERT INTO `utenti` (nome , cognome , data_di_nascita , codice_fiscale, numero_telefono) VALUES ?", [
                        [
                            [
                                req.body.state.Nome,
                                req.body.state.Cognome,
                                req.body.state.DataDiNascita,
                                req.body.state.CodiceFiscale.toUpperCase(),
                                req.body.state.NumeroTelefono

                            ]
                        ]
                    ]
                    )
                        .catch(err => { throw err; });

                    let idAccount = results.insertId;

                    //Inserimento Account
                    results = await db.query('INSERT INTO `account` (id_account , email , password) VALUES ?', [
                        [
                            [
                                idAccount,
                                req.body.state.Email,
                                pass_encrypted
                            ]
                        ]
                    ])
                        .catch(err => { throw err; });

                    stato = 200;
                }

                sendEmail(req.body.state.Nome,
                    req.body.state.Cognome,
                    req.body.state.Email,
                    req.body.state.DataDiNascita,
                    req.body.state.CodiceFiscale.toUpperCase(),
                    req.body.state.NumeroTelefono);
            }
        });

        res.send(stato).status;
    }
    catch (err) {
        console.log(err);
        next(createError(500));
    }

}

const sendEmail = (nome, cognome, email, DataDiNascita, CodiceFiscale, NumeroTelefono) => {
    console.log("Sending email");
    //METTERE GLI ALTRI DATI E TOGLIERE LA PASSWORD
    let output = `<h1>RIEPILOGO ACCOUNT</h1>
                  <br />
                  <p> Hai creato il tuo account! Ora puoi accedere con le tue nuove credenziali:</p>
                  <p>Nome: ${nome}</p>
                  <p>Cognome: ${cognome}</p>
                  <p>Nome Utente: ${email}</p>
                  <p>Data di Nascita: ${DataDiNascita}</p>
                  <p>Codice Fiscale: ${CodiceFiscale}</p>
                  ${NumeroTelefono !== "" ? `<p>Numero di Telefono: ${NumeroTelefono}</p>` : ""}`;

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
        subject: "Account Magic Travel",
        html: output
    };

    transporter.sendMail(mailOptions, err => {
        if (err)
            console.log(err);

        console.log("Email Sent");
    });
}

module.exports = router;