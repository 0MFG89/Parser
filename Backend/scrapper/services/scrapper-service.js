const puppeteer = require('puppeteer');

class ScrapperService {

   async scrapInfiniteScroll(page) {
      let lastHeight = await page.evaluate('document.body.scrollHeight');
      while (true) {
         await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
         await new Promise((resolve) => setTimeout(resolve, 30000));
         const newHeight = await page.evaluate('document.body.scrollHeight');
         if (newHeight === lastHeight) {
            break;
         }
         lastHeight = newHeight;
      }
   }

   async scrapData(url) {
      const browser = await puppeteer.launch({
         headless: false,
         args: [
            '--proxy-server=135.148.171.194:18080',
            '--no-sandbox',
         ]
      });

      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36');
      page.setDefaultNavigationTimeout(0);

      try {
         await page.goto(url, {
            waitUntil: 'networkidle2'
         });
      } catch (e) {
         console.log(e)
      }

      //await this.scrapInfiniteScroll(page);

      const previewsData = await page.evaluate(() => {
         return Array.from(document.querySelectorAll(".movieList_item"))
                     .map(el => el.innerHTML);
      });
      const refs = await page.evaluate(() => {
         return Array.from(document.querySelectorAll(".movieList_item > a"))
                     .map(el => el.href);
      });
      const describtionsData = await this.scrapDescriptionsData(refs, page);
      await browser.close();
      return {previewsData, describtionsData};
   }

   async scrapDescriptionsData(refs, page) {
      const data = [];
      try {
         for (const ref of refs) {
            await page.goto(ref, {
               waitUntil: 'networkidle2'
            });

            const name = await page.evaluate(() => {
               return 'Title:' + document.querySelector(".trailer_title").innerHTML + '|';
            });

            const info = await page.evaluate(() => {
               return document.querySelector('.filmInfo').innerHTML;
            });

            data.push(name+info);
         }
      } catch (e) {
         console.log(e)
      }
      return data;
   }

}

module.exports = new ScrapperService();