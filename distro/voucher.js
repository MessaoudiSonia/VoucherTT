const { registerFont, createCanvas } = require('canvas');
const { argv } = require('process');

async function createVoucher50(voucherData) {

  const columnNumber = 5
  const lineNumber = 10
  const documentWidth = 2480
  const documentHeight = 3510
  const canvas = createCanvas(documentWidth, documentHeight, 'pdf')
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = 'black';
  ctx.textAlign = "center";
  for (var j = 0; j < lineNumber; j++) {
    for (var i = 0; i < columnNumber; i++) {
      ctx.font = "32px Arial"; // set font
      const textTT = 'TUNISIE TELECOM 1DT';
      let metricsTT = ctx.measureText(textTT);
      let textWidthTT = ctx.measureText(textTT).width;
      let textHeightTT = metricsTT.actualBoundingBoxAscent + metricsTT.actualBoundingBoxDescent;
      ctx.fillStyle = 'black';
      ctx.fillText(textTT, (((2 * i + 1) * ((documentWidth - (5 * textWidthTT)) / 10)) + i * textWidthTT) + textWidthTT / 2, 52 + j * (documentHeight / lineNumber) + textHeightTT);

      ctx.font = "52px Arial"; // set font
      const coderecharge = voucherData[i * 5 + j].code;
      let metricsCR = ctx.measureText(coderecharge);
      let textWidthCR = ctx.measureText(coderecharge).width;
      let textHeightCR = metricsCR.actualBoundingBoxAscent + metricsCR.actualBoundingBoxDescent;
      ctx.fillStyle = 'black';
      ctx.fillText(coderecharge, (((2 * i + 1) * ((documentWidth - (5 * textWidthCR)) / 10)) + i * textWidthCR) + textWidthCR / 2, 52 + 30 + j * (documentHeight / lineNumber) + 2 * textHeightTT);

      ctx.font = "24px Arial"; // set font
      const numeroserie = voucherData[i * 5 + j].ns;
      let textWidthNS = ctx.measureText(numeroserie).width;
      ctx.fillStyle = 'black';
      ctx.fillText(numeroserie, (((2 * i + 1) * ((documentWidth - (5 * textWidthNS)) / 10)) + i * textWidthNS) + textWidthNS / 2, 52 + 30 + j * (documentHeight / lineNumber) + 2 * textHeightTT + textHeightCR);

      ctx.font = "24px Arial"; // set font
      const droittimbre = voucherData[i * 5 + j].price;
      let textWidthDT = ctx.measureText(droittimbre).width;
      ctx.fillStyle = 'black';
      ctx.fillText(droittimbre, (((2 * i + 1) * ((documentWidth - (5 * textWidthDT)) / 10)) + i * textWidthDT) + textWidthDT / 2, 52 + 25 + j * (documentHeight / lineNumber) + 2 * textHeightTT + 2 * textHeightCR);

      ctx.font = "30px Arial"; // set font
      const distributeur = voucherData[i * 5 + j].codedistributeur;
      let metricsD = ctx.measureText(distributeur);
      let textWidthD = ctx.measureText(distributeur).width;
      let textHeightD = metricsD.actualBoundingBoxAscent + metricsD.actualBoundingBoxDescent;
      ctx.fillStyle = 'black';
      ctx.fillText(distributeur, (((2 * i + 1) * ((documentWidth - (5 * textWidthD)) / 10)) + i * textWidthD) + textWidthD / 2, 52 + 42 + j * (documentHeight / lineNumber) + 2 * textHeightTT + 2 * textHeightCR + textHeightD);
    }
  }
  const buffer = canvas.toBuffer('application/pdf', {
    title: 'voucher-TT',
    keywords: 'Nodejs canvas',
    creationDate: new Date()
  });
  return buffer;
}

async function createVoucher100(voucherData) {

  const col = 5
  const line = 20
  const width = 4960
  const height = 7020
  const canvas = createCanvas(width, height, 'pdf')
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = 'black';
  ctx.textAlign = "center"; // center text
  for (var j = 0; j < line; j++) {
    for (var i = 0; i < col; i++) {
      ctx.font = "40px Arial"; // set font
      const textTT = 'TUNISIE TELECOM 1DT';
      let metricsTT = ctx.measureText(textTT);
      let textWidthTT = ctx.measureText(textTT).width;
      let textHeightTT = metricsTT.actualBoundingBoxAscent + metricsTT.actualBoundingBoxDescent;
      ctx.fillStyle = 'black';
      ctx.fillText(textTT, (((2 * i + 1) * ((width - (5 * textWidthTT)) / 10)) + i * textWidthTT) + textWidthTT / 2, 32 + j * (height / line) + textHeightTT);

      ctx.font = "80px Arial"; // set font
      const coderecharge = voucherData[i * 5 + j].code;
      let metricsCR = ctx.measureText(coderecharge);
      let textWidthCR = ctx.measureText(coderecharge).width;
      let textHeightCR = metricsCR.actualBoundingBoxAscent + metricsCR.actualBoundingBoxDescent;
      ctx.fillStyle = 'black';
      ctx.fillText(coderecharge, (((2 * i + 1) * ((width - (5 * textWidthCR)) / 10)) + i * textWidthCR) + textWidthCR / 2, 32 + 50 + j * (height / line) + 2 * textHeightTT);

      ctx.font = "36px Arial"; // set font
      const numeroserie = voucherData[i * 5 + j].ns;
      let textWidthNS = ctx.measureText(numeroserie).width;
      ctx.fillStyle = 'black';
      ctx.fillText(numeroserie, (((2 * i + 1) * ((width - (5 * textWidthNS)) / 10)) + i * textWidthNS) + textWidthNS / 2, 32 + 50 + j * (height / line) + 2 * textHeightTT + textHeightCR);

      ctx.font = "36px Arial"; // set font
      const droittimbre = voucherData[i * 5 + j].price;
      let textWidthDT = ctx.measureText(droittimbre).width;
      ctx.fillStyle = 'black';
      ctx.fillText(droittimbre, (((2 * i + 1) * ((width - (5 * textWidthDT)) / 10)) + i * textWidthDT) + textWidthDT / 2, 32 + 40 + j * (height / line) + 2 * textHeightTT + 2 * textHeightCR);

      ctx.font = "50px Arial"; // set font
      const distributeur = voucherData[i * 5 + j].codedistributeur;
      let metricsD = ctx.measureText(distributeur);
      let textWidthD = ctx.measureText(distributeur).width;
      let textHeightD = metricsD.actualBoundingBoxAscent + metricsD.actualBoundingBoxDescent;
      ctx.fillStyle = 'black';
      ctx.fillText(distributeur, (((2 * i + 1) * ((width - (5 * textWidthD)) / 10)) + i * textWidthD) + textWidthD / 2, 32 + 66 + j * (height / line) + 2 * textHeightTT + 2 * textHeightCR + textHeightD);
    }
  }

  const buffer = canvas.toBuffer('application/pdf', {
    title: 'voucher-TT',
    keywords: 'Nodejs canvas',
    creationDate: new Date()
  })
  return buffer;
}

module.exports = { createVoucher50, createVoucher100 };
