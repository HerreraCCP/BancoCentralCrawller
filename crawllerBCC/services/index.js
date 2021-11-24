// crawller => colocar no docker     |
// API => Nest.js para API / swagger |

const fs = require('fs');
const request = require('request');
const puppeteer = require('puppeteer');
const request_client = require('request-promise-native');
const path = require('path');
const https = require('https');

const { logWarn, myDownload } = require('../utils/general/index');

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

    this._initialUrl = 'https://www.bcb.gov.br/cedulasemoedas/moedas';
    this._moedasEmitidas =
      'https://www.bcb.gov.br/cedulasemoedas/moedasemitidas';
  }

  async _createNewPage() {
    const pg = await this.browser.newPage();
    await pg.setViewport({ width: 1040, height: 768 });
    return pg;
  }

  async init() {
    logWarn('iniciando...');
    try {
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
      this.page = await this._createNewPage();
      logWarn('Configuracoes realizadas com sucesso...');
    } catch (error) {
      return {
        err: true,
        data: {
          error,
          errorMessage: `Init had has an error`,
        },
      };
    }
  }

  async open() {
    logWarn('Iniciando segunda etapa de url e load da pagina...');
    try {
      await this.page.goto(this._moedasEmitidas, { waitUntil: 'load' });
      await this.page.waitForNavigation();
      logWarn('The second step has been done...');
    } catch (error) {
      return {
        err: true,
        data: {
          error,
          errorMessage: '',
        },
      };
    }
  }

  async takeRequestsAndMountTheArray() {
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

    await this.page.goto(this._moedasEmitidas);
  }

  async takeResponseAndMountTheArray() {
    this.page.on('response', async (response) => {
      const _response = response.url();
      this.auxiliary.push({ _response });
    });
  }

  //  <img title="moeda" alt="moeda"
  //  src="/content/cedulasemoedas/cedulas_e_moedas/moedasemitidasbc/M75Fv.JPG"
  //   class="img-fluid">
  //  </img>

  async downloadAndSaveImages() {
    try {
      const _dirname = '../assets/match';
      const images = await this.page.$$eval('img', (x) =>
        [].map.call(x, (img) => img.src)
      );

      for (let i = 0; i < images.length; i++) {
        const fileName = images[i].split('/').pop();
        // fileName ==> M07fv.jpg

        const filePath = path.resolve(_dirname, fileName);
        // filePath ==> /Users/herrera/Desktop/Projects/Herrera/NODE/bcb/crawllerBCC/services/M07fv.jpg

        // const writeStream = fs.createWriteStream(filePath);

        const file = fs.createWriteStream(filePath);
        https
          .get(images[i], (response) => {
            response.pipe(file);

            file.on('finish', () => {
              file.close(resolve(true));
            });
          })
          .on('error', (error) => {
            console.warn('error ==>', error);
            fs.unlink();
          });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async execute() {
    logWarn('\n The software has been started!');

    await this.init();
    await this.open();
    await this.takeRequestsAndMountTheArray();
    await this.takeResponseAndMountTheArray();
    await this.downloadAndSaveImages();
    logWarn('\n Isso é tudo, pessoal!');
  }
}

const ME = process.env.MOEDAS_EMITIDAS;
const MO = process.env.MOEDAS;

return new Scrapper().execute();
