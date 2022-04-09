const crypto = require("crypto-js");

function decripta(stringaDaDecriptare, chiave) {
    let stringaDecriptata = crypto.AES.decrypt(stringaDaDecriptare, chiave).toString();
    let id = ""
    for (var i = 0; i < stringaDecriptata.length; i++) {
        //se i è dispari allora prendo la cifra questo perchè la stringa decriptata contiene i reali valori dell'id nelle posizioni dispari
        if ((i % 2) === 1) {
            id = id + stringaDecriptata[i];
        }
    }
    return id;
}
export default decripta;
