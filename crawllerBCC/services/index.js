const fs = require('fs');
const moment = require('moment');
const fetch = require('node-fetch');
const Promise = require('bluebird');
const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');
const dotenv = require('dotenv').config();
const request_client = require('request-promise-native');
const { data } = require('cheerio/lib/api/attributes');
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

    console.warn('THIS ==>', this.username, this.password);
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
    console.info('Iniciando...');
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
    console.info('Initial...');
    try {
      await this.page.goto(this._moedasEmitidas, { waitUntil: 'load' });
      await this.page.waitForNavigation();
      console.info('The first step has been done...');
    } catch (error) {
      return {
        err: true,
        data: {
          error,
          errorMessage: `Login had has an error`,
        },
      };
    }
  }

  async execute() {
    console.info('\n The software has been started!');

    await this.init();
    await this.open();
    await this.console.info('\n Isso é tudo, pessoal!');
  }
}

const ME = process.env.MOEDAS_EMITIDAS;
const MO = process.env.MOEDAS;

return new Scrapper().execute();
