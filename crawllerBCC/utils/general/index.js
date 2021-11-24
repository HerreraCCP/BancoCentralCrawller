const { colours } = require('../json/index');
const fs = require('fs');
const path = require('path');
const https = require('https');

module.exports.htmlToJson = (div, obj) => {
  if (!obj) obj = [];
  var tag = {};

  tag['tagName'] = div.tagName;
  tag['children'] = [];

  for (var i = 0; i < div.children.length; i++) {
    tag['children'].push(htmlToJson(div.children[i]));
  }

  for (var i = 0; i < div.attributes.length; i++) {
    var attr = div.attributes[i];
    tag['@' + attr.name] = attr.value;
  }

  return tag;
};

module.exports.removeDuplicates = async function (data) {
  return Array.from(
    data.filter((value, index) => data.indexOf(value) === index)
  );
};

module.exports.quantityOfTags = async function (pag) {
  const regex = /\<([^\>]+)\>/g;
  let tes = await pag.evaluate((el) => el.innerHTML);

  let i = 0;
  do {
    i++;
  } while (regex.test(tes));
  return i;
};

module.exports.autoScroll = async function (page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
};

module.exports.logWarn = (res) => {
  console.log(colours.fg.yellow, JSON.stringify(res, ' ', 4), colours.reset);
};

module.exports.logInfo = (res) => {
  console.log(colours.fg.cyan, JSON.stringify(res, ' ', 4), colours.reset);
};

module.exports.logRed = (res) => {
  console.log(colours.fg.red, JSON.stringify(res, ' ', 4), colours.reset);
};

module.exports.uploadDeArquivos = (
  caminho,
  nomeDoArquivo,
  callbackImagemCriada
) => {
  const tiposValidos = ['jpg', 'png', 'jpeg'];
  const tipo = path.extname(caminho);
  const tipoEhValido = tiposValidos.indexOf(tipo.substring(1)) !== -1;

  if (tipoEhValido) {
    const novoCaminho = `./assets/imagens/${nomeDoArquivo}${tipo}`;

    fs.createReadStream(caminho)
      .pipe(fs.createWriteStream(novoCaminho))
      .on('finish', () => callbackImagemCriada(false, novoCaminho));
  } else {
    const erro = 'Tipo é inválido';
    console.log('Erro! Tipo inválido');
    callbackImagemCriada(erro);
  }
};

module.exports.myDownload = (url, destination) =>
  new Promise((resolve, reject) => {
    const file = fs.createWriteStream(`../../assets/images/${destination}`);
    https
      .get(url, (response) => {
        response.pipe(file);

        file.on('finish', () => {
          file.close(resolve(true));
        });
      })
      .on('error', (error) => {
        fs.unlink(destination);

        reject(error.message);
      });
  });
