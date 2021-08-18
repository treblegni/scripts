const puppeteer = require('puppeteer');
let url = process.env.A_URL;

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
  url = process.env.A_URL;
}

const resolveImage = async (imgurl) => {
  const { createWorker } = require('tesseract.js');
  const worker = createWorker();

  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  const { data: { text } } = await worker.recognize(imgurl);
  await worker.terminate();
  return text;
};

(async () => {
  const 
    browser = await puppeteer.launch({headless: false}),
    page = await browser.newPage();

  let error = '';

  while (true) {
    try {
      console.log('attempting');
      await page.goto(url,{timeout: 6000});
      if (error.includes('input#add-to-cart-button')) {
        const captcha = await page.$('input#captchacharacters');
        
        if (captcha) {
          const
            textElement = await page.$('img'),
            text = await page.evaluate(async (el) => {
              return await resolveImage(el.src);
            },textElement);
          await page.type('input#captchacharacters',text);
          await page.click('');
          await page.waitForTimeout(2000);
        }
      }
      await page.click('input#add-to-cart-button');
      await page.waitForTimeout(10000);
      await page.click('input[aria-labelledby="attachSiNoCoverage-announce"]');
      await page.waitForTimeout(2000);
      await page.click('input[aria-labelledby="attach-sidesheet-checkout-button-announce"]');
      break;
    }
    catch(e) {
      error = e.message;
      continue;
    }
  }
  console.log('checking out');
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