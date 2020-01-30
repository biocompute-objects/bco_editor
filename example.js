// https://pptr.dev/
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
	  //headless: false,
	  //slowMo: 250 // slow down by 250ms
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:8080/bco_editor');
  // TODO: wait for the page loading spinning wheel to be hidden.

  // TODO: assert tutorial page is accessible and all assets load.
  // BUG: cannot use browser forward/back button navigation.

  // TODO: assert login fails with unregistered user
  //await page.waitFor('#login');
  //await page.type('input[name=email]', 'test@example.com');
  //await page.type('input[name=password]', 'test');
  //await page.click('#login');
  // TODO: assert login error message
  // TODO: assert server responds with HTTP Status 401 Unauthorized 

  // Register a new user.
  await page.waitFor('#register');
  await page.type('input[name=fname]', 'Test');
  await page.type('input[name=lname]', 'User');
  await page.type('input[name=email_r]', 'test@example.com');
  await page.type('input[name=password_r]', 'test');
  await page.click('#register');
  //await page.waitForNavigation({waitUntil: 'load'});
  // TODO: assert registration success message
  // TODO: assert server responds with HTTP Status 200 Success

  // TODO: assert registration fails with existing user

  await browser.close();
})();

//await page.waitForNavigation({waitUntil: 'load'});
//const [response] = await Promise.all([
//  page.waitForNavigation(waitOptions),
//  page.click(selector, clickOptions),
//]);
