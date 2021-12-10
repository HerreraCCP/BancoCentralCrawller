const fs = require('fs');
const path = require('path');
const https = require('https');
const fetch = require('node-fetch');
const puppeteer = require('puppeteer');
const util = require('util');
var logger = require('../utils/classes/logger');

// crawller => colocar no docker     |
// API => Nest.js para API / swagger |

class Scrapper {
  constructor() {
    this.page = null;
    this.browser = null;
    this.result = [];
    this.auxiliary = [];
    this.imageArray = [];

    this.DICT = [
      'bcookie',
      'bscookie',
      'spectroscopyId',
      'timezone',
      'li_rm',
      'li_at',
      'liap',
      'JSESSIONID',
      'lidc',
      'UserMatchHistory',
    ];

    this._moedasEmitidas =
      'https://www.bcb.gov.br/cedulasemoedas/moedasemitidas';

    this._initialUrl = 'https://www.bcb.gov.br/cedulasemoedas/moedas';
  }

  async _createNewPage() {
    const pg = await this.browser.newPage();
    await pg.setViewport({ width: 1040, height: 768 });
    return pg;
  }

  async init() {
    try {
      logger.info('Primeira etapa init...');
      this.browser = await puppeteer.launch({
        dumpio: true,
        headless: false,
        ignoreDefaultArgs: ['--disable-extensions'],
        ignoreHTTPSErrors: true,
        args: [
          '--fast-start',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-setuid-sandbox',
          '--no-first-run',
          '--no-sandbox',
          '--no-zygote',
          '--window-size=1040,768',
        ],
        userDataDir: './_logs',
        ignoreDefaultArgs: ['--disable-extensions'],
        ignoreHTTPSErrors: true,
      });
      logger.info('Etapa init() finalizada com sucesso ...');
      this.page = await this._createNewPage();
    } catch (error) {
      return {
        err: true,
        data: {
          error,
          errorMessage: `Init had has an error ${error}`,
        },
      };
    }
  }

  async open() {
    try {
      logger.info('Iniciando segunda etapa open()...');

      await this.page.goto(this._moedasEmitidas, { waitUntil: 'load' });
      await this.page.waitForNavigation();

      logger.info('A segunda etapa open() finalizada...');
    } catch (error) {
      return {
        err: true,
        data: {
          error,
          errorMessage: `A etapa Open() apresentou erro ${error}`,
        },
      };
    }
  }

  async takeRequestsAndMountTheArray() {
    try {
      logger.info('Iniciando a terceira etapa...');

      await this.page.setRequestInterception(true);
      this.page.on('request', async (request) => {
        const request_url = request.url();
        const request_headers = request.headers();
        const request_post_data = request.postData();

        this.result.push({
          request_url,
          request_headers,
          request_post_data,
        });

        request.continue();
      });

      logger.info(
        `terceira etapa fechado e navegando para ${this._moedasEmitidas}`
      );

      await this.page.goto(this._moedasEmitidas);
    } catch (error) {
      return {
        err: true,
        data: {
          error,
          errorMessage: `A terceira etapa apresentou erro ==> ${error}`,
        },
      };
    }
  }

  async takeResponseAndMountTheArray() {
    try {
      logger.info('Iniciando a quarta etapa...');

      this.page.on('response', async (response) => {
        const _response = response.url();
        this.auxiliary.push({ _response });
      });
      logger.info('Finalizando a quarta etapa...');
    } catch (error) {
      return {
        err: true,
        data: {
          error,
          errorMessage: `A quarta etapa apresentou erro ==> ${error}`,
        },
      };
    }
  }

  async downloadAndSaveImages() {
    try {
      const _imageFolder = path.join(
        __dirname,
        '../../../bcb/crawllerBCC/utils/assets/images'
      );
      const _logArchive = path.join(
        __dirname,
        '../../../bcb/crawllerBCC/utils/assets/logs/imgSalvas.txt'
      );

      logger.info('Iniciando a quinta etapa...');
      logger.info(`Aonde será gravado as imagens ${_imageFolder}`);

      const mapImages = await this.page.$$eval('img', (x) =>
        [].map.call(x, (img) => img.src)
      );

      mapImages.forEach((e) => {
        const fileName = e.split('/').pop(); // fileName ==> popup.png
        const filePath = path.resolve(__dirname, fileName); // /Users/herrera/Desktop/Projects/Herrera/NODE/bcb/crawllerBCC/services/M09fv.JPG
        this.saveImageToDisk2(e, fileName, _imageFolder);
      });

      fs.readFileSync(_logArchive);
      fs.writeFileSync(
        _logArchive,
        mapImages.forEach((c) => c)
      );
      fs.closeSync();

      logger.info('Finalizando a quinta etapa...');
    } catch (error) {
      return {
        err: true,
        data: {
          error,
          errorMessage: logger.error(
            `A quinta etapa apresentou erro ==> ${error}`
          ),
        },
      };
    }
  }

  async saveImageToDisk(url, filename, directory) {
    fetch(url)
      .then((res) => {
        const dest = fs.createWriteStream(`${directory}/${filename}`);
        res.body.pipe(dest);
      })
      .catch((err) => {
        if (err.code === 'ETIMEDOUT') {
          console.log(
            'Deu ruim: ',
            util.inspect(err, { showHidden: true, depth: 2 })
          );
        }
        console.log(err);
      });
  }

  saveImageToDisk2(url, filename, directory) {
    fetch(url)
      .then((res) => {
        const dest = fs.createWriteStream(`${directory}/${filename}`);
        res.body.pipe(dest);
      })
      .catch((err) => {
        if (err.code === 'ETIMEDOUT') {
          console.log(
            'Deu ruim: ',
            util.inspect(err, { showHidden: true, depth: 2 })
          );
        }
        console.log(err);
      });
  }

  async saveLog(fileTxt, contents) {
    fs.writeFile(fileTxt, contents, (err) => {
      if (!err) console.warn('Deu BOM no gravacao');
      else console.warn('Deu RUIM no gravacao');
    });
  }

  async lerArquivo(caminhoArquivo) {
    return new Promise((resolve, reject) => {
      readFile(caminhoArquivo, (err, data) => {
        err ? reject(err) : resolve(data);
      });
    });
  }

  async createDatabase() {
    const mergeArray = { ...this.result, ...this.auxiliary };
  }

  async execute() {
    logger.info('\n The software has been started!');

    await this.init();
    await this.open();
    // await this.takeRequestsAndMountTheArray();
    // await this.takeResponseAndMountTheArray();
    await this.downloadAndSaveImages();
    // await this.createDatabase();

    logger.info('\n Isso é tudo, pessoal!');
  }
}

const ME = process.env.MOEDAS_EMITIDAS;
const MO = process.env.MOEDAS;

return new Scrapper().execute();
