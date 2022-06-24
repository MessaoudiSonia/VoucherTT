const crypto = require('crypto');
const NodeRSA = require('node-rsa');

async function decodeData(privateKeyvar, encryptedData, codeDistributeur, droitTimbre) {

    return new Promise((resolve, reject) => {
        const key = new NodeRSA();
        key.importKey(new Buffer.from(privateKeyvar, 'base64'), 'pkcs8-private-der');
        const outprivateKey = key.exportKey();
        var encryptedOutPutJSON = [];

        var singleencrypted = encryptedData.split("=")
        if (singleencrypted.length < 2) {
            reject("SOMETHING WRONG WITH THE ENCRYPTION ALGO")
        }
        for (var dotencrypted in singleencrypted) {
            let initialstr = singleencrypted[dotencrypted]
            if (initialstr != '') {
                var voucher = new Object();
                let base64encryptxt = singleencrypted[dotencrypted] + "=";
                let encrytxtasbuffer = new Buffer.from(base64encryptxt, 'base64');
                var decryptedtxt = crypto.privateDecrypt({ key: outprivateKey, padding: crypto.constants.RSA_PKCS1_PADDING }, encrytxtasbuffer);
                const message = decryptedtxt.toString('utf-8').split(',');
                voucher.code = message[0];
                const year = message[4].substring(0, 4);
                const month = message[4].substring(4, 6);
                const day = message[4].substring(6);
                const formateddate = day + "/" + month + "/" + year;
                voucher.ns = "NS : " + message[1] + "   " + "Validite : " + formateddate;
                voucher.price = "Droit de timbre " + (parseFloat(droitTimbre).toFixed(3)) + "  " + "Montant" + ((1 * (parseFloat(message[2]) / 1000).toFixed(3)) + (1 * parseFloat(droitTimbre).toFixed(3))).toFixed(3).toString();
                voucher.codedistributeur = codeDistributeur;
                encryptedOutPutJSON.push(voucher)
            }
        }
        resolve(JSON.stringify(encryptedOutPutJSON));
    });
}

module.exports = { decodeData };
