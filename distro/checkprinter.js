var snmp = require("net-snmp");

const errorValues= [
  "niveau papier bas",
  "pas de papier",
  "niveau toner faible ",
  "pas de toner" ,
  "porte ouverte" ,
  "bourrage papier",
  "hors ligne" ,
  "service demandé",
  "bac d'entrée manquant",
  "bac de sortie manquant" ,
  "marqueur d'approvisionnement manquant",
  "sortie presque pleine",
  "sortie pleine",
  "bac d'entrée vide" ,
  "en retard prévenir la maintenance"
];
const errorShortValues= [
  "niveau papier bas",
  "pas de papier",
  "niveau toner faible ",
  "pas de toner" ,
  "porte ouverte" ,
  "bourrage papier",
  "hors ligne" ,
  "service demandé"
];


async function checkPrinterStatus(printerIpAddress, mainWindow) {
  var session = snmp.createSession(printerIpAddress, "public");
  var printererrorstateiod = ["1.3.6.1.2.1.25.3.2.1.5.1"];
  mainWindow.webContents.send('verif', { status: 'busy' , message1:"verification de l'état de l'imprimante"});

  return new Promise(function(resolve, reject) {
    session.get(printererrorstateiod, function (error, varbinds) {
      console.log("error1: ",error);
      console.log("varbinds1: ",varbinds);
      session.close();
      if (error)  {reject(error);}
      else {
        for (let varbind of varbinds) {
          if (snmp.isVarbindError(varbind)) { reject(snmp.isVarbindError(varbind));}
          else {
            if (varbind.value==1 ||  varbind.value==2 ){
              resolve(varbind)}
            else if ( varbind.value==5 || varbind.value==3 ){
              reject('failure reason');}
          }
        }
      }
    });
  });
}

async function getErrorCode(printerIpAddress) {
  var session = snmp.createSession(printerIpAddress, "public");
  var expliciterroroidcode = ["1.3.6.1.2.1.25.3.5.1.2.1"];
  return new Promise(function(resolve, reject) {
    session.get(expliciterroroidcode, function (error, varbinds) {
      console.log("error2: ",error);
      console.log("varbinds2: ",varbinds);
      session.close();
      if (error)  {reject(error);
      } else {
        for (let varbind of varbinds) {
          if (snmp.isVarbindError(varbind)) { reject(snmp.isVarbindError(varbind));}
          else {
            resolve(varbind.value)
          }
        }
      }
    });
  });
}


function getErrorDescription(errorCode) {
  var message='';
  if(errorCode.byteLength>1){
    var x = (errorCode.readUInt8(0)*128)+(errorCode.readUInt8(1));
    for (var i=0;i<errorValues.length;i++)
    {
      if((x<<i &  32768)===32768){
        message += "\n";
        message += errorValues[i];
        console.log("message1",message);
      }
    }
  }
  else{
    var x = (errorCode.readUInt8(0));
    for (var i=0;i<errorShortValues.length;i++)
    {
      if((x<<i &  128)===128){
        message += "\n";
        message += errorShortValues[i];
        console.log("message2",message);
      }
    }
  }
  return message;
}


module.exports = {checkPrinterStatus, getErrorCode, getErrorDescription};
