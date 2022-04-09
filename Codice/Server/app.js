var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//Require di Gestione Account
let autenticazione = require('./routes/Gestione Account/autenticazione');
let gestione_account = require('./routes/Gestione Account/gestione_account');
let gestione_economica = require('./routes/Gestione Account/gestione_economica');
let registrazione = require('./routes/Gestione Account/registrazione');

//Require per Gestione Annunci
let gestione_annuncio = require('./routes/Gestione Annunci/gestione_annuncio');
let inserimento_annuncio = require('./routes/Gestione Annunci/inserimento_annuncio');
let recupero_annuncio = require('./routes/Gestione Annunci/recupero_annunci');

//Require per Gestione PDF
let gestione_PDF = require('./routes/Gestione PDF/gestione_pdf');

//Require per Gestione Prenotazioni Effettuate
let dettagli_prenotazione_effettuata = require('./routes/Gestione Prenotazioni Effettuate/dettagli_prenotazioni_effettuate');
let gestione_prenotazioni = require('./routes/Gestione Prenotazioni Effettuate/gestione_prenotazioni_effettuate');
let recupero_prenotazioni_effettuate = require('./routes/Gestione Prenotazioni Effettuate/recupero_prenotazioni_effettuate');

//Require per Gestione Prenotazioni Ricevute
let dettagli_prenotazioni_ricevute = require('./routes/Gestione Prenotazioni Ricevute/dettagli_prenotazioni_ricevute');
let lista_prenotazioni_ricevute = require('./routes/Gestione Prenotazioni Ricevute/lista_prenotazioni_ricevute');

//Require per Ricerca e Prenota
let richiesta_prenotazione = require('./routes/Ricerca e Prenota/richiesta_prenotazione');
let trova_annunci = require('./routes/Ricerca e Prenota/trova_annunci');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//App.use per Gestione Account
app.use('/autenticazione', autenticazione);
app.use('/gestione_account', gestione_account);
app.use('/gestione_economica', gestione_economica);
app.use('/registrazione', registrazione);

//App.use per Gestione Annunci
app.use('/gestione_annunci', gestione_annuncio);
app.use('/inserimento_annunci', inserimento_annuncio);
app.use('/recupero_annunci', recupero_annuncio);

//App.use per Gestione PDF
app.use('/gestione_pdf', gestione_PDF);

//App.use per Gestione Prenotazioni Effettuate
app.use('/dettagli_prenotazione_effettuata', dettagli_prenotazione_effettuata);
app.use('/gestione_prenotazione', gestione_prenotazioni);
app.use('/prenotazioni_effettuate', recupero_prenotazioni_effettuate);

//App.use per Gestione Prenotazioni Ricevute
app.use('/dettagli_prenotazioni_ricevute', dettagli_prenotazioni_ricevute);
app.use('/lista_prenotazioni_ricevute', lista_prenotazioni_ricevute);

//App.use per Ricerca e Prenota
app.use('/richiesta_prenotazione', richiesta_prenotazione);
app.use('/trova_annunci', trova_annunci);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
