const puppeteer = require('puppeteer');
let url = process.env.A_URL;

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
  url = process.env.A_URL;
}

(async () => {
  const 
    browser = await puppeteer.launch({headless: false}),
    page = await browser.newPage();
  let span = '';
  while (true) {
    try {
      console.log('attempting');
      await page.goto(url,{timeout: 6000});
      await page.click('a[title="See All Buying Options"]');
      await page.waitForSelector('span.a-offscreen');
      span = await page.$('span.a-offscreen');
      // await page.click('input[aria-labelledby="attachSiNoCoverage-announce"]');
      // await page.waitForTimeout(2000);
      // await page.click('input[aria-labelledby="attach-sidesheet-checkout-button-announce"]');
      break;
    }
    catch(e) {
      console.log(e);
    }
  }
  console.log('checking out');
  await page.evaluate((span) => {
    console.log(span);
  },span);
  // await page.waitForSelector('input[type="email"]');
  // await page.type('input[type="email"]',process.env.A_EMAIL);
  // await page.click('input#continue');
  // await page.waitForSelector('input[type="password"]');
  // await page.type('input[type="password"]',process.env.A_PASSWORD);
  // await page.click('input#signInSubmit');
  // await page.waitForNavigation();
  // await page.waitForSelector('input[aria-labelledby="bottomSubmitOrderButtonId-announce"]');
  // await page.click('input[aria-labelledby="bottomSubmitOrderButtonId-announce"]');
})();