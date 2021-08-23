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
  await page.exposeFunction('resolveImage',async (imgurl) => {
    const worker = createWorker();

    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(imgurl);
    await worker.terminate();
    return text;
  });
  let span = '';
  while (true) {
    try {
      console.log('attempting');
      await page.goto(url,{timeout: 5000});
      const captcha = await page.$('input#captchacharacters');
        
      if (captcha) {
        const textElement = await page.$('img');
        const text = await page.evaluate(async (el) => {
          return await resolveImage(el.src);
        },textElement);
        if (text) {
          await page.type('input#captchacharacters',text);
          await page.click('button[type="submit"]');
        }
      }
      await page.waitForSelector('a[title="See All Buying Options"]',{timeout: 2000});
      await page.click('a[title="See All Buying Options"]');
      await page.waitForSelector('span.a-offscreen');
      span = await page.$('span.a-offscreen');
      await page.click('input[aria-labelledby="attachSiNoCoverage-announce"]');
      await page.waitForTimeout(2000);
      await page.click('input[aria-labelledby="attach-sidesheet-checkout-button-announce"]');
      break;
    }
    catch(e) {
      console.log(e);
    }
  }
  console.log('checking out');
  await page.waitForSelector('input[type="email"]');
  await page.type('input[type="email"]',process.env.A_EMAIL);
  await page.click('input#continue');
  await page.waitForSelector('input[type="password"]');
  await page.type('input[type="password"]',process.env.A_PASSWORD);
  await page.click('input#signInSubmit');
  await page.waitForNavigation();
  await page.waitForSelector('input[aria-labelledby="bottomSubmitOrderButtonId-announce"]');
  await page.click('input[aria-labelledby="bottomSubmitOrderButtonId-announce"]');
})();