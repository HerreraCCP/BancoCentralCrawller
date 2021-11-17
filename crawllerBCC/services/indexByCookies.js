const fs = require('fs');
const fetch = require('node-fetch');
const Promise = require('bluebird');
const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');
const dotenv = require('dotenv').config();
const request_client = require('request-promise-native');

class Scrapper {
  constructor(page) {
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

    this._initialUrl = page;
  }

  async configScrapper() {
    console.info('The configScrapper step has been started');
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
      });
      this.page = await this._createNewPage();
      console.info('The configScrapper step  has been done...');
    } catch (error) {
      return {
        err: true,
        data: {
          error,
          errorMessage: `The configScrapper step had has an error`,
        },
      };
    }
  }

  async navigationToThePage() {
    console.info('The navigationToThePage step has been started');
    try {
      await this.page.goto(this._initialUrl, { waitUntil: 'load' });
      await this.page.waitForNavigation();
      console.info('The second step has been done...');
    } catch (error) {
      return {
        err: true,
        data: {
          error,
          errorMessage: `The navigationToThePage step had has an error`,
        },
      };
    }
  }

  async getCookies() {
    console.info('The getCookies step has been started');
    console.info('Extraindo cookies...', this.DICT);
    try {
      const client = await this.page.target().createCDPSession();
      const sig = await client.send('Network.getAllCookies');
      this.cookies = sig?.cookies;
      console.info('The getCookies step has been done...');
    } catch (error) {
      return {
        err: true,
        data: {
          error,
          errorMessage: `Get Cookies had has an error`,
        },
      };
    }
  }

  async processCookies() {
    try {
      console.info('The processCookies step has been started');
      if (this.cookies) {
        console.info('Processando cookies...');
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

  async takeAllRequest() {
    const results = []; // collects all results
    let paused = false;
    let pausedRequests = [];

    const nextRequest = () => {
      // continue the next request or "unpause"
      if (pausedRequests.length === 0) paused = false;
      // continue first request in "queue"
      else pausedRequests.shift()(); // calls the request.continue function
    };

    await this.page.setRequestInterception(true);
    this.page.on('request', (request) => {
      console.warn('==> request <==', request);
      if (paused) pausedRequests.push(() => request.continue());
      else {
        console.warn('==> else entrei aqui <==');
        paused = true; // pause, as we are processing a request now
        request.continue();
      }
    });

    this.page.on('requestfinished', async (request) => {
      const response = await request.response();
      const responseHeaders = response.headers();
      let responseBody;
      if (request.redirectChain().length === 0)
        responseBody = await response.buffer(); // body can only be access for non-redirect responses

      const information = {
        url: request.url(),
        requestHeaders: request.headers(),
        requestPostData: request.postData(),
        responseHeaders: responseHeaders,
        responseSize: responseHeaders['content-length'],
        responseBody,
      };

      results.push(information);
      nextRequest(); // continue with next request
    });

    this.page.on('requestfailed', (request) => {
      // handle failed request
      nextRequest();
    });

    await this.page.goto(this._initialUrl, { waitUntil: 'networkidle0' });
    await browser.close();
  }

  async execute() {
    console.info('\n The software has been started!');

    await this.configScrapper();
    await this.navigationToThePage();
    // await this.getCookies();
    // await this.processCookies();
    await this.takeAllRequest();

    console.info('\n Isso é tudo, pessoal!');
  }

  async _createNewPage() {
    const pg = await this.browser.newPage();
    await pg.setViewport({ width: 1040, height: 768 });
    return pg;
  }
}

const PAGE = process.env.PAGE;
return new Scrapper(PAGE).execute();
