const { app, BrowserWindow } = require('electron');
const url = require('url');
const ipc = require('electron').ipcMain;
var printer = require('printer');
const ipp = require("ipp");
var { checkPrinterStatus, getErrorCode, getErrorDescription } = require('./checkprinter');
const { decodeData } = require('./decrypt')
const { createVoucher50, createVoucher100 } = require('./voucher')
var os = require('os');

var currentUserName = os.userInfo().username;
var failLoadUrl = false;
let mainWindow;
var printeripregexp = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;

if (handleSquirrelEvent(app)) {
  return;
}
function handleSquirrelEvent(application) {
  if (process.argv.length === 1) {
    return false;
  }
  const ChildProcess = require('child_process');
  const path = require('path');
  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);
  const spawn = function (command, args) {
    let spawnedProcess, error;
    try {
      spawnedProcess = ChildProcess.spawn(command, args, {
        detached: true,
      });
    } catch (error) { }
    return spawnedProcess;
  };
  const spawnUpdate = function (args) {
    return spawn(updateDotExe, args);
  };
  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      spawnUpdate(['--createShortcut', exeName]);
      setTimeout(application.quit, 1000);
      return true;
    case '--squirrel-uninstall':
      spawnUpdate(['--removeShortcut', exeName]);
      setTimeout(application.quit, 1000);
      return true;
    case '--squirrel-obsolete':
      application.quit();
      return true;
  }
}
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true
    },
  });

  mainWindow.loadURL(
    url.format({
       //pathname: 'localhost:4200',
      pathname: 'vouchertt-voucher-print.apps.ocptt.tunisietelecom.tn/',
      protocol: 'http',
      slashes: false,
    })
  );
  mainWindow.webContents.on("did-fail-load", function () {
    mainWindow.loadURL('file://' + __dirname + '/404Electron.html');
    failLoadUrl = true;
  });

  mainWindow.on('close', function (e) {
    e.preventDefault();
    require('electron').dialog.showMessageBox(this,
      {
        type: 'question',
        buttons: ['oui', 'non'],
        title: 'confirmation',
        message: 'vous etes sur de vouloir quitté l application'
      }).then((retruntype) => {
      if (retruntype.response === 0) {
        if (failLoadUrl) {
          mainWindow.destroy();
        }
        mainWindow.webContents.send('verifClose', { status: 'verification' });
      } else if (retruntype.response === 1) {
        return;
      }
    }).catch((errortype) => {
      return;
    });
  });
}

app.on('ready', createWindow);
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
app.on('activate', function () {
  if (mainWindow === null) createWindow();
});

ipp.parse.handleUnknownTag = function (tag, name, length, read) {
  return length ? read(length) : undefined;
};

ipc.on('getprinters', (event, args) => {
  getPrinterList().then((re) => {
    return mainWindow.webContents.send('lesImprimantes', re);
  });

});
ipc.on('noJob', (event, args) => {
  mainWindow.destroy();
});
ipc.on('print', (event, args) => {
  main(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
});

ipc.on('test status imprimante', (event, args) => {
  checkPrinterStatus(args[0], mainWindow).then((status) => {
    mainWindow.webContents.send('verif', { status: 'free', message1: "verification terminer" });
    mainWindow.webContents.send('printOffline', { status: 'nok' });
  }).catch((error) => {

    getErrorCode(args[0]).then((ec) => {
      var message = getErrorDescription(ec);
      mainWindow.webContents.send('verif', { status: 'free', message1: "verification terminer" });
      mainWindow.webContents.send('printOffline', { status: "ok", name: message });

    }).catch((baderror) => {
      mainWindow.webContents.send('verif', { status: 'free', message1: "verification terminer" });
      mainWindow.webContents.send('printOffline', { status: "ok", name: baderror.toString() });
    })
  })
});

async function main(privateKey, nomImprimante, encryptedData, idDocument, codeDistributeur, droitTimbre, ipImprimante) {
  mainWindow.webContents.send('verif', { status: 'free', message1: "en cours de traitement" });
  checkPrinterStatus(ipImprimante, mainWindow).then((status) => {
    mainWindow.webContents.send('verif', { status: 'free', message1: "verification terminer" });
    mainWindow.webContents.send('printOffline', { status: 'nok' });
    decodeData(privateKey, encryptedData, codeDistributeur, droitTimbre).then((decryptresult) => {
      if (eval(decryptresult).length == 50) {
        createVoucher50(eval(decryptresult)).then((result) => {
          printDocument(ipImprimante, eval(result)).then((ippjobdata) => {
            var jobId = ippjobdata['job-attributes-tag']['job-id'];
            watchPrintJob(jobId, ipImprimante, idDocument, nomImprimante);
          }).catch((ipperror) => {
            console.log("CREATING PRINTING JOB ERROR", ipperror)
          })
        });
      } else if (eval(decryptresult).length == 100) {
        createVoucher100(eval(decryptresult)).then((result) => {
          printDocument(ipImprimante, eval(result)).then((ippjobdata) => {
            var jobId = ippjobdata['job-attributes-tag']['job-id'];
            console.log(jobId);
            watchPrintJob(jobId, ipImprimante, idDocument, nomImprimante);
          }).catch((ipperror) => {
            console.log("CREATING PRINTING JOB ERROR", ipperror)
          })
        });
      }

    }).catch((errdecrypt) => { console.log(errdecrypt) });
  })
    .catch((error) => {

      getErrorCode(ipImprimante).then((ec) => {
          var message = getErrorDescription(ec);
          mainWindow.webContents.send('verif', { status: 'free', message1: "verification terminer" });
          mainWindow.webContents.send('printOffline', { status: "ok", name: message });
          var currentPrintingJobs = printer.getPrinter(nomImprimante);
          var attributes = currentPrintingJobs.attributes;
          mainWindow.webContents.send('statusPrint', { status: currentPrintingJobs.status, id: idDocument, nomImprimante, attributes });
          mainWindow.webContents.send('verif', { status: 'free', message1: "erreur d'impression" });
        }
      ).catch((baderror) => {
        var currentPrintingJobs = printer.getPrinter(nomImprimante);
        mainWindow.webContents.send('statusPrint', { status: currentPrintingJobs.status, id: idDocument, nomImprimante });
        mainWindow.webContents.send('verif', { status: 'free', message1: "erreur d'impression" });
        mainWindow.webContents.send('verif', { status: 'free', message1: "verification terminer" });
        mainWindow.webContents.send('printOffline', { status: "ok", name: baderror.toString() });
      })
    })
}

async function getPrinterList() {

  var output = [];
  var printerList = printer.getPrinters();
  for (var printerProperties in printerList) {
    var result = '';
    for (var properties in printerList[printerProperties]) {
      var a = printerList[printerProperties][properties]
      var t = a.toString().match(printeripregexp);
      if (t != null) {
        var ipaddress = t[0];
        result += printerList[printerProperties].name.toString();
        result += "|";
        result += ipaddress;
        output.push({ name: printerList[printerProperties].name.toString(), ip: ipaddress });
      }
    }
  }
  return output;
}

async function printDocument(ipImprimante, rawdata) {

  var uri = "http://" + ipImprimante + ":631/ipp/print";
  var printdata = ipp.serialize({
    "operation": "Print-Job",
    "operation-attributes-tag": {
      "attributes-charset": "utf-8",
      "attributes-natural-language": "en",
      "printer-uri": uri,
      "document-format": "application/pdf",
      "requesting-user-name": currentUserName,
    },
    "job-attributes-tag": {
      "media-col": {
        "media-top-margin": 0,
        "media-bottom-margin": 0,
        "media-left-margin": 0,
        "media-right-margin": 0,
      }
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
        console.log("CANCEL JOB RETURN", res);
        successCallback(res);
      }
    })
  });
}

function watchPrintJob(jobId, ipImprimante, idDocument, nomImprimante) {

  var uri = "http://" + ipImprimante + ":631/ipp/print";
  var timeoutcounter = 20;
  var p = Promise.resolve(timeoutcounter);
  var printStatus = "";
  var stateJobreason = "";
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
  while (timeoutcounter > 0) {
    (timeoutcounter => {
      p = p.then(() => {
        return new Promise(function (resolve, reject) {
          if (printStatus.toString() == "completed" && stateJobreason.toString() == "1") {
            resolve();
          }
          setTimeout(function () {
            ipp.request(uri, printdatastatus, function (errr, ress) {
              if (errr) {
                reject(errr)
              } else {
                printStatus = ress['job-attributes-tag']['job-state']
                stateJobreason = ress['job-attributes-tag']['job-impressions-completed'];
                console.log("PRINT STATUS", printStatus)
                console.log("PRINT JOB REASON", stateJobreason)
              }
            });
            resolve()
          }, 1000);
        })
      })
    })(timeoutcounter)
    timeoutcounter--
  }
  p = p.then(data => {
    if (printStatus.toString() != "completed" && stateJobreason.toString() != "1") {
      cancelPrintDocument(ipImprimante, jobId).then((canceljobretour) => {
        console.log(canceljobretour);
        mainWindow.webContents.send('statusPrint', { status: printStatus.toString(), id: idDocument, nomImprimante });
        mainWindow.webContents.send('verif', { status: 'free', message1: "erreur d'impression" });
      }).catch((canceljocatch) => {
        console.log(canceljocatch);
      })
    } else {
      getPrintAttributes(ipImprimante, jobId).then((suc) => { console.log(suc) }).catch((rrr) => { console.log("unxpected error", rrr) })
      mainWindow.webContents.send('statusPrint', { status: 'ok', id: idDocument, nomImprimante });
      mainWindow.webContents.send('verif', { status: 'free', message1: "impression terminer" });
    }
    console.log('Checking complete');
  })
}

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
