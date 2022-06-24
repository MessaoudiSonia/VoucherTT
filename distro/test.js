const ipp = require("ipp");
var os = require('os');
var fs = require("fs");
var filename = "./TestTT50.pdf";

async function printDocument(ipImprimante, rawdata) {

  var uri = "http://" + ipImprimante + ":631/ipp/print";
  var printdata = ipp.serialize({
    "operation": "Print-Job",
    "operation-attributes-tag": {
      "attributes-charset": "utf-8",
      "attributes-natural-language": "en",
      "printer-uri": uri,
      "job-name": "Vouche-TT-2154",
      "requesting-user-name": currentUserName,
      "document-format": "application/pdf"
    },
    data: rawdata,
  });
  return new Promise((successCallback, failureCallback) => {
    ipp.request(uri, printdata, function (err, res) {
      if (err) {
        failureCallback(err)
      } else {
        successCallback(res);
      }
    })
  });
}


var currentUserName = os.userInfo().username;

async function getPrintAttributes(ipImprimante, jobId) {

  var uri = "http://" + ipImprimante + ":631/ipp/print";
  var printdatastatus = ipp.serialize({
    "operation": "Get-Job-Attributes",
    "operation-attributes-tag": {
      "attributes-charset": "utf-8",
      "attributes-natural-language": "en",
      "printer-uri": uri,
      "job-id": jobId,
      "requesting-user-name": currentUserName,
    },
  });

  return new Promise((successCallback, failureCallback) => {
    ipp.request(uri, printdatastatus, function (err, res) {
      if (err) {
        failureCallback(err)
      } else {
        console.log("PRINT ATTRIBUTES VALUE", res);
        successCallback(res);
      }
    })
  });
}

async function cancelPrintDocument(ipImprimante, jobId) {

  var uri = "http://" + ipImprimante + ":631/ipp/print";
  var printdata = ipp.serialize({
    "operation": "Cancel-Job",
    "operation-attributes-tag": {
      "attributes-charset": "utf-8",
      "attributes-natural-language": "en",
      "printer-uri": uri,
      "job-id": jobId,
      "requesting-user-name": currentUserName,
    }
  });
  return new Promise((successCallback, failureCallback) => {
    ipp.request(uri, printdata, function (err, res) {
      if (err) {
        failureCallback(err)
      } else {
        if(res['statusCode'] === "client-error-not-possible") {
          failureCallback(res['statusCode'])
        }
        console.log("CANCEL JOB RETURN", res);
        successCallback(res);
      }
    })
  });
}

// fs.readFile(filename, function(err,data) {
  // printDocument('10.1.32.6', data).then((okprint)=>{
    // console.log("PRINTING", okprint)
    // var jobId = okprint['job-attributes-tag']['job-id'];
    // cancelPrintDocument('10.1.32.6', jobId).then((okcancel)=>{
      // console.log("okcancel", okcancel)
    // }).catch((nokcancel)=>{
      // console.log("nokcancel", nokcancel)
    // })
// // getPrintAttributes('10.1.32.6', jobId).then((ok)=>{
// //       console.log("ok", ok);
// //     }).catch((nok)=>{console.log("nok", nok)})

  // }).catch((notprint)=>{
    // console.log("ERROR PRINTING", notprint)
  // });
// });


getPrintAttributes('10.55.1.37', 1).then((ok)=>{
  console.log("ok", ok);
  // cancelPrintDocument('10.1.32.6', 45).then((okcancel)=>{
    // console.log("okcancel", okcancel)
  // }).catch((nokcancel)=>{console.log("nokcancel", nokcancel)})
}).catch((nok)=>{console.log("nok", nok)})

// cancelPrintDocument('10.1.32.6', 44).then((okcancel)=>{
//   console.log("okcancel", okcancel)
// }).catch((nokcancel)=>{console.log("nokcancel", nokcancel)})
