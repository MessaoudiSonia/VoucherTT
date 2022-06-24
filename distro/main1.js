const ipc = require('electron').ipcMain;
var snmp = require("net-snmp");
var ipp = require("ipp");
const { spawn } = require('child_process');
const { encryptedData, privateKey } = require('./const');
const { decodeData } = require('./decrypt')
var printerIpAddress = '10.1.32.6';
var codeDistributeur = "MIB2";
var droitTimbre = "0.140";
var fs = require("fs");

var uri = "http://" + printerIpAddress + ":631/ipp/print";

var printeripregexp = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;

async function startWorker50(encryptedDataInput) {

  return new Promise((resolve, reject) => {
    const sink = spawn('node', [require.resolve(__dirname + '/voucher-50.js'), encryptedDataInput], {});
    var result = '';
    sink.stdout.on('data', function (data) {
      result += data;
    });
    sink.on('close', function () {
      resolve(Buffer.from(result, 'hex'));
    });
    sink.on('error', function (err) { reject(err.stack) })
  })
}

async function startWorker100(encryptedDataInput) {

  return new Promise((resolve, reject) => {
    const sink = spawn('node', [require.resolve(__dirname + '/voucher-100.js'), encryptedDataInput], {});
    var result = '';
    sink.stdout.on('data', function (data) {
      result += data;
    });
    sink.on('close', function (code) {
      resolve(Buffer.from(result, 'hex'));
    });
    sink.on('error', function (err) { reject(err) })
  })
}

async function printDocument(uri, rawdata) {
  var printdata = ipp.serialize({
    "operation": "Print-Job",
    "operation-attributes-tag": {
      "attributes-charset": "utf-8",
      "attributes-natural-language": "en",
      "printer-uri": uri,
      "job-name": "Vouche-TT-2154",
      "requesting-user-name": "Anis BEN ABDENNEBI",
      "document-format": "application/pdf"
    },
    data: rawdata,
  });
  console.log(rawdata);
  console.log(uri);
  // return new Promise((successCallback, failureCallback) => {
  //   ipp.request(uri, printdata, function (err, res) {
  //     if (err) {
  //       failureCallback(err)
  //     } else {
  //       successCallback(res);
  //     }
  //   })
  // });
}

ipp.parse.handleUnknownTag = function (tag, name, length, read) {
  return length ? read(length) : undefined;
};

async function main() {
  decodeData(privateKey, encryptedData, codeDistributeur, droitTimbre).then((decryptresult) => {
    if (eval(decryptresult).length == 50) {
      startWorker50(decryptresult).then((result) => {
        fs.writeFileSync('./TestTTTTTT50.pdf', result);
        printDocument(uri, result).then((ippjobdata) => {
          // console.log(ippjobdata['job-attributes-tag']['job-id'])
          // console.log("PRINTING JOB SEND TO PRINTER SUCCESS", ippjobdata)
        }).catch((rrr) => {
          console.log("PRINTING ERROR", rrr)
        })
      }).catch((errorcanvas) => {console.log(errorcanvas)});
    } else if (eval(decryptresult).length == 100) {
      startWorker100(decryptresult).then((result) => {
        printDocument(result).then((data) => { console.log("PRINTING SUCCESS", data) }).catch((rrr) => { console.log("PRINTING ERROR", rrr) })
        // console.log(result)
      });
    }

  }).catch((errdecrypt) => { console.log(errdecrypt) });
}

main().then((ok) => {console.log("ok")}).catch((nok)=> {console.log("nok")})

