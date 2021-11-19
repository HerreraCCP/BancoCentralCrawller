class HttpCookieInterceptor {
  foundCookies = [];

  httpSetCookiesKey = 'set-cookie';

  constructor(client) {
    this.client = 'https://www.bcb.gov.br/cedulasemoedas/moedasemitidas';

    // Setup listener for handling finished request
    client.on('Network.responseReceivedExtraInfo', (response) =>
      this.captureHttpCookies(response)
    );
  }

  async create(page) {
    // open sessions to DevTools
    const client = await page.target().createCDPSession();
    await client.send('Network.enable');
    // Setup request interceptor rules, in this case we will intercept all request
    await client.send('Network.setRequestInterception', {
      patterns: [
        {
          urlPattern: '*',
        },
      ],
    });
    await client.on('Network.requestIntercepted', async (e) => {
      // Let the request continue, we don't need anything from here
      await client.send('Network.continueInterceptedRequest', {
        interceptionId: e.interceptionId,
      });
    });
    return new HttpCookieInterceptor(client);
  }

  captureHttpCookies(request) {
    if (request && request.headers && request.headers[this.httpSetCookiesKey]) {
      const cookieString = request.headers[this.httpSetCookiesKey];
      const httpCookies = setCookie.parse(cookieString);
      this.foundCookies = [...this.foundCookies, ...httpCookies];
    }
  }

  getCookies() {
    return this.foundCookies;
  }

  async execute() {
    console.warn('\n The software has been started!');

    await this.create();
    // await this.getCookies();
    // await this.processCookies();

    await this.console.warn('\n Isso é tudo, pessoal!');
  }
}
const ME = process.env.MOEDAS_EMITIDAS;
const MO = process.env.MOEDAS;

return new HttpCookieInterceptor().execute();
