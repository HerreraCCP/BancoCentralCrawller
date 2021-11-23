// crawller => colocar no docker     |
// API => Nest.js para API / swagger |

const fs = require('fs');
const request = require('request');
const puppeteer = require('puppeteer');
const request_client = require('request-promise-native');
const {
  htmlToJson,
  logWarn,
  logRed,
  logInfo,
} = require('../utils/general/index');

class Scrapper {
  constructor() {
    this.page = null;
    this.browser = null;
    this.result = [];

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

    this.page.on('request', (request) => {
      const request_url = request.url();
      const request_headers = request.headers();
      const request_post_data = request.postData();

      this.result.push({
        request_url,
        request_headers,
        request_post_data,
      });

      request_client({
        uri: this._moedasEmitidas,
        resolveWithFullResponse: true,
      })
        .then((response) => {
          const response_headers = response.headers;
          const response_body = response.body;
          const response_size = response.headers['content-length'];

          this.result.push({
            response_headers,
            response_size,
            response_body,
          });
          logRed('==> HERE ==>', this.result);
        })
        .catch((error) => {
          request.abort();
          return {
            err: true,
            data: {
              error,
              errorMessage: '',
            },
          };
        });
      request.continue();

      if (!request.isNavigationRequest()) {
        request.continue();
        return;
      }

      const headers = request.headers();
      headers['X-Just-Must-Be-Request-In-Main-Request'] = 1;
      request.continue({ headers });
    });
    // navigate to the website
    await this.page.goto(this.page);
  }

  async downloadImages() {
    logRed('==> ENTREI AQUI <==');
    // await this.page.setRequestInterception(true);
    logRed('==>  <==', this.result);

    // this.page.on('request', (request) => {
    //   logRed('==> ENTREI AQUI 3 <==');
    //   request_client({
    //     uri: this._moedasEmitidas,
    //     resolveWithFullResponse: true,
    //   }).then((response) => {
    //     logRed('==> response <==', response);
    //     const matches = /.*\.(jpg|png|svg|gif)$/.exec(response.url());
    //     logRed('==> matches <==', matches);

    //     if (matches && matches.length === 2) {
    //       const extension = matches[1];
    //       logRed('==> extension <==', extension);
    //       const buffer = response.buffer();
    //       logRed('==> buffer <==', buffer);
    //       fs.writeFileSync(
    //         `../assets/images/${matches[0]}.${extension}`,
    //         buffer,
    //         'base64'
    //       );
    //     }
    //   });
    // });
  }

  async execute() {
    logWarn('\n The software has been started!');

    await this.init();
    await this.open();
    await this.takeRequestsAndMountTheArray();
    // await this.downloadImages();
    logWarn('\n Isso é tudo, pessoal!');
  }
}

const ME = process.env.MOEDAS_EMITIDAS;
const MO = process.env.MOEDAS;

return new Scrapper().execute();

// request_url: 'https://www.bcb.gov.br/api/servico/sitebcb/modaldados?tronco=cedulasemoedas&guidLista=d0b2d79f-d91a-44ef-b09d-959120d767dd&identificador=moeda_cruzeiro-CrS0_01',

// request_headers: {
//   'sec-ch-ua': '"Chromium";v="93", " Not;A Brand";v="99"',
//   accept: 'application/json, text/plain, */*',
//   referer: 'https://www.bcb.gov.br/cedulasemoedas/moedasemitidas',
//   'sec-ch-ua-mobile': '?0',
//   'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.0 Safari/537.36',
//   'sec-ch-ua-platform': '"Windows"'
// },

// request_post_data: undefined,

// response_headers: {
//   'content-type': 'text/html',
//   'last-modified': 'Fri, 12 Nov 2021 21:10:52 GMT',
//   'accept-ranges': 'bytes',
//   etag: '"be7041c69d8d71:0"',
//   'cache-control': 'max-age=90',
//   'strict-transport-security': 'max-age=16070400; includeSubDomains',
//   vary: 'Accept-Encoding',
//   connection: 'close',
//   date: 'Fri, 19 Nov 2021 13:14:10 GMT',
//   age: '21',
//   'content-length': '3000'
// },

// response_size: '3000',

// response_body:
// '<!doctype html>\r\n' +
//   '\r\n' +
//   '<html lang="pt-br">\r\n' +
//   '\r\n' +
//   '<head>\r\n' +
//   '\t<meta http-equiv="X-UA-Compatible" content="IE=edge"/>\r\n' +
//   '\t<meta charset="utf-8">\r\n' +
//   '\t<base href="/">\r\n' +
//   '\r\n' +
//   '\t<title>Banco Central do Brasil</title>\r\n' +
//   '\r\n' +
//   '\t<meta name="description" content="Banco Central do Brasil">\r\n' +
//   '\t<meta name="viewport" content="width=device-width, initial-scale=1">\r\n' +
//   '\t<meta name="robots" content="index, follow"/>\r\n' +
//   '\t<meta name="AdsBot-Google" content="noindex"/>\r\n' +
//   '\t<meta name="theme-color" content="#025c75"/>\r\n' +
//   '\t<meta name="google-site-verification" content="HrSauVp28E-CmIunToYrF1-gaMfDbWESxMFUDXFMqPA"/>\r\n' +
//   '\r\n' +
//   '\t<link rel="alternate" hreflang="pt" href="/">\r\n' +
//   '\t<link rel="alternate" hreflang="en" href="/en/">\r\n' +
//   '\r\n' +
//   '\t<link rel="icon" type="image/x-icon" href="/favicon.ico">\r\n' +
//   '\r\n' +
//   '\t<!-- diz ao servidor que futuras conexoes ira usar -->\r\n' +
//   '\t<link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin="">\r\n' +
//   '\t<link rel="preconnect" href="https://www.google-analytics.com" crossorigin="">\r\n' +
//   '\r\n' +
//   '\t<!-- css -->\r\n' +
//   '\t<link rel="preload" href="/assets/fonts/iconic/iconic-lg.woff" as="font" type="font/woff" crossorigin="">\r\n' +
//   '\t<link rel="preload" href="/assets/fonts/iconic/iconic-md.woff" as="font" type="font/woff" crossorigin="">\r\n' +
//   '\t<link rel="preload" href="/assets/fonts/iconic/iconic-sm.woff" as="font" type="font/woff" crossorigin="">\r\n' +
//   '\t<link rel="preload" href="/assets/fonts/iconic/iconic-sm.ttf" as="font" type="font/ttf" crossorigin="">\r\n' +
//   '\t<link rel="preload" href="/assets/fonts/iconic/iconic-md.ttf" as="font" type="font/ttf" crossorigin="">\r\n' +
//   '\t<link rel="preload" href="/assets/fonts/iconic/iconic-lg.ttf" as="font" type="font/ttf" crossorigin="">\r\n' +
//   '\r\n' +
//   '\t<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Cormorant+Garamond:300,300i,400,400i,500,500i,600,600i,700,700i&amp;display=swap" lazyload="">\r\n' +
//   '\t<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Ubuntu:300,300i,400,400i,500,500i,700,700i&amp;display=swap" lazyload="">\r\n' +
//   '\t<!-- production -->\r\n' +
//   '<link rel="stylesheet" href="/styles.0d727c78c8902405f519.css"></head>\r\n' +
//   '\r\n' +
//   '<body>\r\n' +
//   '\t<noscript>Essa pagina depende do javascript para abrir, favor habilitar o javascript do seu browser!</noscript>\r\n' +
//   '\t<app-root></app-root>\r\n' +
//   '\t<script src="https://www.googletagmanager.com/gtag/js?id=UA-65460906-3" async=""></script>\r\n' +
//   '\t<!-- <script src="/assets/js/webchat.js" defer></script> -->\r\n' +      '<script src="/runtime-es2015.8b0a1f25e225372a7b99.js" type="module"></script><script src="/runtime-es5.8b0a1f25e225372a7b99.js" nomodule defer></script><script src="/polyfills-es5.b326da36cc2f6970a2f5.js" nomodule defer></script><script src="/polyfills-es2015.e03bf1a8c2367ce6e60d.js" type="module"></script><script src="/scripts.f7549c2f9f7144149051.js" defer></script><script src="/vendor-es2015.fa659b6741b80a7445e3.js" type="module"></script><script src="/vendor-es5.fa659b6741b80a7445e3.js" nomodule defer></script><script src="/main-es2015.f3765830afdb31076fea.js" type="module"></script><script src="/main-es5.f3765830afdb31076fea.js" nomodule defer></script></body>\r\n' +
//   '\r\n' +
//   '</html>'
// }
