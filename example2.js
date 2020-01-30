// https://pptr.dev/
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
	  //headless: false,
	  //slowMo: 250 // slow down by 250ms
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:8080/bco_editor');

  // login
  await page.waitFor('#login');
  await page.type('input[name=email]', 'test@example.com');
  await page.type('input[name=password]', 'test');
  await page.click('#login');
  // wait for and click the "Create Object" link
  await page.waitFor('#create');
  await page.click('#create');
  // wait for the Create Object form
  await page.waitFor('#editor_div');

  await browser.close();
})();
