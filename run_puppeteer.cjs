const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.goto('https://html.duckduckgo.com/html/?q=Alexander+Florez+maltrato+expareja+Semana');
  const html = await page.content();
  console.log(html.substring(0, 500));
  await browser.close();
})();
