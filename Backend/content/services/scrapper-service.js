const puppeteer = require('puppeteer');

class ScrapperService {

   getFilmsPreviewsExtractedData(data) {
      return data.map(el => {
         const imgIndex = el.indexOf('srcset="');
         const img = el.slice(imgIndex + 8, el.indexOf('.jpg') + 4);
         const nameIndex = el.indexOf('>', el.indexOf('<a class="movieItem_title"'))+1;
         const name = el.slice(nameIndex, el.indexOf('</a>', nameIndex));
         const genreIndex = el.indexOf('>', el.indexOf('<span class="movieItem_genres"'))+1;
         const genre = el.slice(genreIndex, el.indexOf('</span>', genreIndex));
         const yearIndex = el.indexOf('>', el.indexOf('<span class="movieItem_year"'))+1;
         const year = el.slice(yearIndex, el.indexOf('</span>', yearIndex));
         return {img, name, genre, year};
      });
   }

   getFilmDescribtionsExtractedData(data) {
      return data.map(el => {
         const imgIndex = el.indexOf('srcset="', el.indexOf('class="picture picture-poster"')+10);
         const img = el.slice(imgIndex + 8, el.indexOf('.jpg', imgIndex+8)+4);
         const nameIndex = el.indexOf('Title:');
         const name = el.slice(nameIndex+6, el.indexOf('|', nameIndex + 6))
                        .split(', ')
                        .slice(0, -1)
                        .join(', ');
         const genreIndex = el.indexOf('<nav class="filmInfo_genreMenu menuBtn">');
         const genre = el.slice(genreIndex + 40, el.indexOf('</nav>', genreIndex + 40))
                         .split('</span>')
                         .map(g => g.slice(g.indexOf('>') + 1, g.length))
                         .slice(0, -1)
                         .join(', ');
         const aboutIndex = el.indexOf('<div class="visualEditorInsertion filmDesc_editor more_content"');
         let about = el.slice(aboutIndex + 85, el.indexOf('</div>', aboutIndex + 85))
         about = about.slice(about.indexOf('>')+1, about.indexOf('</p>'))
                      .replace(/<[^>]*>/g, '')
                      .replace(/&nbsp;/g, " ");
         const durationIndex = el.indexOf('<span class="filmInfo_infoData">', el.indexOf('<span class="filmInfo_infoName">Продолжительность</span>'));
         const duration = el.slice(durationIndex + 32, el.indexOf('</span>', durationIndex + 32));
         const yearIndex = el.indexOf('<span class="filmInfo_infoData">', el.indexOf('<span class="filmInfo_infoName">Год выпуска</span>'));
         const year = el.slice(yearIndex + 32, el.indexOf('</span>', yearIndex + 32));
         const ageIndex = el.indexOf('<span class="filmInfo_infoData">', el.indexOf('<span class="filmInfo_infoName">Возраст</span>'));
         const age = el.slice(ageIndex + 32, el.indexOf('</span>', ageIndex + 32));
         return {img, name, genre, about, duration, year, age};
      });
   }

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
            `--proxy-server=${process.env.PROXY}`,
            '--no-sandbox',
         ]
      });

      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36');
      page.setDefaultNavigationTimeout(0);
      let attempts = 0;
      
      while (attempts < 5) {
         try {
            attempts++;
            await page.goto(url, {
               waitUntil: 'networkidle2'
            });
            break;
         } catch (e) {
            console.log(e)
         }
      }

      //await this.scrapInfiniteScroll(page);

      let previewsData = await page.evaluate(() => {
         return Array.from(document.querySelectorAll(".movieList_item"))
                     .map(el => el.innerHTML);
      });
      const refs = await page.evaluate(() => {
         return Array.from(document.querySelectorAll(".movieList_item > a"))
                     .map(el => el.href);
      });
      let describtionsData = await this.scrapDescriptionsData(refs, page);
      previewsData = this.getFilmsPreviewsExtractedData(previewsData);
      describtionsData = this.getFilmDescribtionsExtractedData(describtionsData);
      await browser.close();
      return {previewsData, describtionsData};
   }

   async scrapDescriptionsData(refs, page) {
      const data = [];

      for (const ref of refs) {
         let attempts = 0;
         while (attempts < 10) {
            try {
               attempts++;
               await page.goto(ref, {
                  waitUntil: 'networkidle2'
               });
               break;
            } catch (e) {
               console.log(e);
               continue;
            }
         }

         const name = await page.evaluate(() => {
            return 'Title:' + document.querySelector(".trailer_title").innerHTML + '|';
          });

         const info = await page.evaluate(() => {
            return document.querySelector('.filmInfo').innerHTML;
         });

         data.push(name+info);
      }
      return data;
   }

}

module.exports = new ScrapperService();