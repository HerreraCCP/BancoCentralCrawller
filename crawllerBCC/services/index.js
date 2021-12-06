const fs = require('fs');
const path = require('path');
const https = require('https');
const request = require('request');
const fetch = require('node-fetch');
const puppeteer = require('puppeteer');
const request_client = require('request-promise-native');
const util = require('util');
const { logWarn, logRed } = require('../utils/general/index');

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
      logWarn('Primeira etapa init...');
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
      logWarn('Etapa init() finalizada com sucesso ...');
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
      logWarn('Iniciando segunda etapa open()...');

      await this.page.goto(this._moedasEmitidas, { waitUntil: 'load' });
      await this.page.waitForNavigation();

      logWarn('A segunda etapa open() finalizada...');
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
      console.warn('Iniciando a terceira etapa...');

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

      console.warn(
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
      console.warn('Iniciando a quarta etapa...');

      this.page.on('response', async (response) => {
        const _response = response.url();
        this.auxiliary.push({ _response });
      });
      console.warn('Finalizando a quarta etapa...');
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
      console.warn('Iniciando a quinta etapa...');

      const _dirname =
        'C:/Users/Herrera/Desktop/Projects/Herrera/NODE/bcb/crawllerBCC/assets/images';
      const mapImages = await this.page.$$eval('img', (x) =>
        [].map.call(x, (img) => img.src)
      );

      mapImages.forEach((e) => {
        // ==> fileName ==> popup.png
        // ==> filePath ==> /Users/herrera/Desktop/Projects/Herrera/NODE/bcb/crawllerBCC/C:/Users/Herrera/Desktop/Projects/Herrera/NODE/bcb/crawllerBCC/assets/images/popup.png
        const fileName = e.split('/').pop();
        const filePath = path.resolve(_dirname, fileName);
        this.saveImageToDisk(e, fileName, _dirname);
      });

      var image = Promise.resolve(mapImages);

      for (let i = 0; i < mapImages.length; i++) {
        // mapImages[i] ==> https://www.bcb.gov.br/assets/img/logo_bacen_preto.png
        const fn = mapImages[i].split('/').pop(); // fn ==> logo_bacen_preto.png
        const fp = path.resolve(_dirname, fn); // fp ==> C:\Users\Herrera\Desktop\Projects\Herrera\NODE\bcb\crawllerBCC\assets\mapImages\logo_bacen_preto.png
        await this.saveImageToDisk(mapImages[i], fn, _dirname);
      }

      console.warn('Finalizando a quinta etapa...');
    } catch (error) {
      return {
        err: true,
        data: {
          error,
          errorMessage: `A quinta etapa apresentou erro ==> ${error}`,
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

  async createDatabase() {
    const mergeArray = { ...this.result, ...this.auxiliary };
  }

  async execute() {
    logWarn('\n The software has been started!');

    await this.init();
    await this.open();
    // await this.takeRequestsAndMountTheArray();
    // await this.takeResponseAndMountTheArray();
    await this.downloadAndSaveImages();
    // await this.createDatabase();

    logWarn('\n Isso é tudo, pessoal!');
  }
}

const ME = process.env.MOEDAS_EMITIDAS;
const MO = process.env.MOEDAS;

return new Scrapper().execute();
