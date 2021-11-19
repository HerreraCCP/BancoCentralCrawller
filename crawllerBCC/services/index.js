const fs = require('fs');
const puppeteer = require('puppeteer');
const setCookie = require('set-cookie-parser');
const request_client = require('request-promise-native');
const {
  autoScroll,
  logWarn,
  logInfo,
  logRed,
} = require('../utils/general/index');

class Scrapper {
  constructor() {
    this.page = null;
    this.browser = null;
    this.accessToken = {};

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
    console.warn('iniciando...');
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
      console.warn('Configuracoes realizadas com sucesso...');
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
    console.warn('Iniciando segunda etapa de url e load da pagina...');
    try {
      await this.page.goto(this._moedasEmitidas, { waitUntil: 'load' });
      await this.page.waitForNavigation();
      console.warn('The second step has been done...');
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

  async process() {
    const result = [];

    await this.page.setRequestInterception(true);

    this.page.on('request', (request) => {
      //console.warn('request.url() ==>', request.url()); //request.url() ==> https://www.bcb.gov.br/api/servico/sitebcb/modaldados?tronco=cedulasemoedas&guidLista=d0b2d79f-d91a-44ef-b09d-959120d767dd&identificador=moeda_primeiro_cruzeiro_CrS50_00
      //console.warn('request.headers() ==>', request.headers()); //request.headers() ==> {
      //   'sec-ch-ua': '"Chromium";v="93", " Not;A Brand";v="99"',
      //   accept: 'application/json, text/plain, */*',
      //   referer: 'https://www.bcb.gov.br/cedulasemoedas/moedasemitidas',
      //   'sec-ch-ua-mobile': '?0',
      //   'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.0 Safari/537.36',
      //   'sec-ch-ua-platform': '"Windows"'
      // }
      //console.warn('request.postData() ==>', request.postData()); //request.postData() ==> undefined

      const request_url = request.url();
      const request_headers = request.headers();
      const request_post_data = request.postData();
      const response_headers = response.headers;
      const response_size = response_headers['content-length'];
      // const response_body = response.body;

      console.warn('==> request_url <==', request_url);
      console.warn('==> request_headers <==', request_headers);
      console.warn('==> request_post_data <==', request_post_data);

      console.warn('==> response_headers <==', response_headers);
      console.warn('==> response_size <==', response_size);

      // result.push({
      //   request_url,
      //   request_headers,
      //   request_post_data,
      //   response_headers,
      //   response_size,
      //   response_body,
      // });
      // console.log('==> Resultado ==>', result);

      if (!request.isNavigationRequest()) {
        request.continue();
        return;
      }

      const headers = request.headers();
      headers['X-Just-Must-Be-Request-In-Main-Request'] = 1;
      request.continue({ headers });
    });
    // navigate to the website
    await this.page.goto(
      'https://www.bcb.gov.br/cedulasemoedas/moedasemitidas'
    );
  }

  async getCookies() {
    try {
      const client = await this.page.target().createCDPSession();
      const sig = await client.send('Network.getAllCookies');
      this.cookies = sig?.cookies;
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

  async processCookies() {
    try {
      console.warn('The processCookies step has been started');
      if (this.cookies) {
        console.warn('Processando cookies...');
        const FN = (k) => this.DICT.includes(k.name);
        this.cookies = this.cookies.filter(FN);
      } else {
        await this.page.close();
        process.exit(1);
      }
    } catch (error) {
      return {
        err: true,
        data: {
          error,
          errorMessage: `Process processCookies Cookies had has an error`,
        },
      };
    }
  }

  async execute() {
    console.warn('\n The software has been started!');
    await this.init();
    await this.open();
    await this.process();
    // await this.getCookies();
    // await this.processCookies();

    await this.console.warn('\n Isso é tudo, pessoal!');
  }
}

const ME = process.env.MOEDAS_EMITIDAS;
const MO = process.env.MOEDAS;

return new Scrapper().execute();
