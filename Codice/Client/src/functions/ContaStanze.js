const contaStanze = stanze => {
    let arr1 = [];
    stanze.forEach(stanza => {
        arr1.push(stanza.numero_posti_letto);
    });

    let arr2 = new Array(Math.max.apply(null, arr1)+1);
    for(let i = 0; i < arr2.length; i++)
        arr2[i] = 0;

    arr1.forEach(elemento => arr2[elemento]++);
    return arr2;
};

export default contaStanze;