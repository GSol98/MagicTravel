const createError = require('http-errors');
const express = require('express');
const nodemailer = require("nodemailer");
const router = express.Router();
const generaPassword = require('../../public/javascripts/generaPassword');

const { config } = require('../../db/config');
const { makeDb, withTransaction } = require('../../db/dbmiddleware');

// La rotta /gestione_account è vietata 
router.get('/', function (req, res, next) {
    next(createError(403));
});

// Gestione delle rotte
router.post("/reimposta_password", reimpostaPassword);
router.post("/modifica_password", modificaPassword);


// Middleware di Modifica Password
async function modificaPassword(req, res, next) {
    const db = await makeDb(config);
    let results = {};

    try {
        await withTransaction(db, async () => {

            // Controllo che la vecchia password inserita dall'utente corrisponda con quella memorizzata nel database
            results = await db.query("SELECT COUNT(*) as account_esistenti  \
                                      FROM `account`  \
                                      WHERE `account`.id_account = ? AND  \
                                            `account`.password = SHA2(?, 512)", [
                [Number.parseInt(req.body.id_account)],
                [req.body.state.passVecchia]
            ])
                .catch(err => { throw err; });

            // Se non corrispondono mando una risposta con un errore
            if (results[0].account_esistenti === 0)
                res.status(500).send();

            // Altrimanti inserisco la nuova password nel database
            else {
                results = await db.query("UPDATE `account`  \
                                            SET `account`.password = SHA2(?, 512)  \
                                            WHERE `account`.id_account = ?", [
                    [req.body.state.passNuova],
                    [Number.parseInt(req.body.id_account)]
                ])
                    .catch(err => { throw err; });

                console.log("Password modificata");
                res.send();
            }
        });
    }
    catch (err) {
        console.log(err);
        next(createError(500));
    }
}


//      Middleware di reimposta password
// Controllo se l'indirizzo mail è esistente, e se lo è genero una password casuale che
// diventa la nuova password dell'account.
// La password viene poi inviata per email all'utente. Il servizio mail utilizzato 
// usa una crittografia standard TLS quindi questa viene inviata non criptata.

async function reimpostaPassword(req, res, next) {
    const db = await makeDb(config);
    let results = {};

    try {
        await withTransaction(db, async () => {
            // Controllo l'esistenza nel database dell'indirizzo mail inserito dall'utente
            results = await db.query("SELECT COUNT(*) AS numero_email  \
                                      FROM `account`  \
                                      WHERE `account`.email = ?", req.body.email)
                .catch(err => { throw err; });

            // Se non viene trovata alcuna corrispondeza interrompo il metodo e rispondo con un errore
            if (results[0].numero_email === 0)
                res.status(404).send();

            else {
                // Viene generata una password casuale
                let password = generaPassword();

                // La password appena generata viene inserita nel database come nuova password per quell'account
                results = await db.query("UPDATE `account`  \
                                          SET `account`.password = SHA2(?, 512)  \
                                          WHERE `account`.email = ?", [[password], [req.body.email]])
                    .catch(err => { throw err; });

                // chiamo la funzione per l'invio della mail
                sendEmail(req.body.email, password);
                res.send();
            }
        });
    }
    catch (err) {
        console.log(err);
        next(createError(500));
    }
}

const sendEmail = (email, password) => {
    console.log("Sending email");

    // Contenuto della mail
    let output = `<h1>Reimposta Password</h1>
                  <br />
                  <p>
                    La tua password è stata modificata. Inserisci quella che ti abbiamo
                    inviato per poter riaccedere al tuo account
                  </p>
                  <p>La tua nuova password è:   <strong>${password}</strong></p>`;

    // Autenticazione all'account gmail dal quale verrà inviata la mail
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

    // Popolamento dei campi della mail 
    let mailOptions = {
        from: '"Magic Travel" <magicTravel.SSTZ@gmail.com>',
        to: email,
        subject: "Reimposta Password",
        html: output
    };

    // Invio della mail 
    transporter.sendMail(mailOptions, err => {
        if (err) {
            console.log(err);
            res.status(500).send();
        }
        console.log("Email Sent");
    });
}

module.exports = router;