const puppeteer = require('puppeteer');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
monitor('span#status', status => {
  // Fires whenever `status` changes
})

(async () => {
  const 
    browser = await puppeteer.launch({headless: false}),
    falcodrinURL = 'https://discord.com/channels/767566223729754122/813861610882990090',
    testURL = 'https://discord.com/channels/380467661575815169/862280541410689064',
    page = await browser.newPage();
    

    await page.goto(testURL);
    await page.type('input[name="email"]',process.env.D_EMAIL);
    await page.type('input[name="password"]',process.env.D_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForSelector('div[dir="ltr"][data-jump-section="global"]');
    
    async function monitor (selector, callback, prevValue) {
      const newVal = await page.$(selector);
      if (newVal !== prevValue) {
        callback(newVal);
      }
      /* add some delay */
      await new Promise(_ => setTimeout(_, 1000))
      /* call recursively */
      monitor (selector, callback, newVal);
    }
})();