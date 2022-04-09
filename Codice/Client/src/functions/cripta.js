const crypto = require("crypto-js");
function cripta(stringaDaCriptare, chiave) {
    let stringaCriptata = crypto.AES.encrypt(stringaDaCriptare, chiave);
    return stringaCriptata;
}
export default cripta;