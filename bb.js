const puppeteer = require('puppeteer');
let url = process.env.BB_URL;

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
  url = process.env.BB_URL;
}

(async () => {
  const 
    browser = await puppeteer.launch({headless: false}),
    page = await browser.newPage();
  while (true) {
    try {
      console.log('attempting');
      await page.goto(url,{timeout: 6000});
      await page.click('button.btn-primary');
      await page.waitForSelector('div.success',{timeout: 3000});
      break;
    }
    catch(e) {
      continue;
    }
  }
  console.log('checking out');
  await page.goto(process.env.BB_CART);
  await page.waitForSelector('button.btn-primary');
  await page.click('button.btn-primary');
  await page.waitForSelector('input[type="email"]');
  await page.type('input[type="email"]',process.env.BB_EMAIL);
  await page.type('input[type="password"]',process.env.BB_PASSWORD);
  await page.click('button.btn-secondary[type="submit"]');
  await page.waitForNavigation();
  await page.waitForSelector('button.button__fast-track');
  await page.click('button.button__fast-track');
})();

//document.querySelector('div#attach-desktop-sideSheet');
//document.querySelector('input#add-to-cart-button').click();
//document.querySelector('input[aria-labelledby="attachSiNoCoverage-announce"]');