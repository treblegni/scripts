const puppeteer = require('puppeteer');
let url= '';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
  url = process.env.BB_URL;
}

(async () => {
  const 
    browser = await puppeteer.launch({headless: false}),
    page = await browser.newPage();
  
    await page.goto(test);
    await page.waitForSelector('button.btn-primary');
    await page.click('button.btn-primary');
    await page.waitForSelector('div.success');
    await page.goto('https://www.bestbuy.com/cart');
    await page.waitForSelector('button.btn-primary');
    await page.click('button.btn-primary');
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]',process.env.BB_EMAIL);
    await page.type('input[type="password"]',process.env.BB_PASSWORD);
    await page.click('button.btn-secondary[type="submit"]');
  })();