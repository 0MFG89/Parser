const scrapperService = require('./scrapper-service');
const mysql = require('mysql2/promise');

class ContentService {
   constructor() {
      this.previewsUrl = {
         'films': process.env.FILMS_URL,
      }
   }

   dropPreviewsSql(category) {
      const db = category === 'films'
                     ? 'FilmPreviews'
                     : 'SerialPreviews';
      return `DROP TABLE ${db}`;
   }

   createPreviewsSql(category) {
      const db = category === 'films'
                     ? 'FilmPreviews'
                     : 'SerialPreviews';
      const name = category === 'films'
                     ? 'filmName'
                     : 'serialName';
      const year = category === 'films'
                     ? 'filmYear'
                     : 'serialYear';
      return `CREATE TABLE ${db}(	
         id integer primary key auto_increment,
         img varchar(255) unique,
         ${name} varchar(255) unique NOT NULL,
         genre varchar(255),
         ${year} varchar(255)
      )`
   }

   insertPreviewsSql(category, el) {
      const db = category === 'films'
                     ? 'FilmPreviews (img, filmName, genre, filmYear)'
                     : 'SerialPreviews (img, serialName, genre, serialYear)';
      return `INSERT INTO ${db} VALUES ("${el.img}", '${el.name}', "${el.genre}", "${el.year}")`;
   }

   dropDescribtionsSql(category) {
      const db = category === 'films'
                     ? 'FilmDescribtions'
                     : 'SerialDescribtions';
      return `DROP TABLE ${db}`;
   }

   createDescribtionsSql(category) {
      const db = category === 'films'
                     ? 'FilmDescribtions'
                     : 'SerialDescribtions';
      const year = category === 'films'
                     ? 'filmYear'
                     : 'serialYear';
      return `CREATE TABLE ${db}(	
         	id integer primary key auto_increment,
            img varchar(255) NOT NULL,
            name varchar(255) NOT NULL,
            genre varchar(255) NOT NULL,
            about text NOT NULL,
            duration varchar(255) NOT NULL,
            ${year} varchar(255) NOT NULL,
            age varchar(255)
      )`
   }

   insertDescribtionsSql(category, el) {
      const db = category === 'films'
                     ? 'FilmDescribtions (img, name, genre, about, duration, filmYear, age)'
                     : 'SerialDescribtions (img, name, genre, about, duration, serialYear, age)';
      return `INSERT INTO ${db} VALUES ("${el.img}", '${el.name}', "${el.genre}", "${el.about}", "${el.duration}", "${el.year}", "${el.age}")`;
   }

   async getDataByCategory(category) {
      return await scrapperService.scrapData(this.previewsUrl[category]);
   }

   async getExtractedData(category) {
      const data = await this.getDataByCategory(category);
      return [this.getPreviewsExtractedData(category, data.previewsData), this.getDescribtionsExtractedData(category, data.describtionsData)];
   }

   getPreviewsExtractedData(data) {
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

   getDescribtionsExtractedData(data) {
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
                       .slice(about.indexOf('>')+1, about.indexOf('</p>'))
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

   async dataToDatabase(category) {
      const data = await this.getExtractedData(category);
      const dbConnection = await mysql.createConnection({
         host: process.env.host,
         user: process.env.user,
         database: process.env.db,
         password: process.env.password
      });
      await dbConnection.execute(this.dropPreviewsSql(category));
      await dbConnection.execute(this.createPreviewsSql(category));
      data[0].forEach(async (el) => await dbConnection.execute(this.insertPreviewsSql(category, el)));
      await dbConnection.execute(this.dropDescribtionsSql(category));
      await dbConnection.execute(this.createDescribtionsSql(category));
      data[1].forEach(async (el) => await dbConnection.execute(this.insertDescribtionsSql(category, el)));
      dbConnection.end();
   }

   async getPreviewsData(category) {
      const dbConnection = await mysql.createConnection({
         host: process.env.host,
         user: process.env.user,
         database: process.env.db,
         password: process.env.password
      });
      const db = category === 'films' 
                  ? 'FilmPreviews'
                  : 'SerialPreviews';
      const sqls = {
         getPreviews: `SELECT * FROM ${db}`
      };
      const [ data ] = await dbConnection.execute(sqls.getPreviews);
      return data;
   }

   async getDescribtionData(category, id) {
      const dbConnection = await mysql.createConnection({
         host: process.env.host,
         user: process.env.user,
         database: process.env.db,
         password: process.env.password
      });

      const db = category === 'films' 
                  ? 'FilmDescribtions'
                  : 'SerialDescribtions';
      const sqls = {
         getDescribtion: `SELECT * FROM ${db} WHERE id=${id}`
      };

      const [ data ] = await dbConnection.execute(sqls.getDescribtion);
      return data[0];
   }
}

module.exports = new ContentService();