const scrapperService = require('./scrapper-service');
const mysql = require('mysql2/promise');
const { filmPreviews, filmsDetails, filmDescribtions } = require('../models');
const detailsService = require('./details-service');


class ContentService {

   async dataToDatabase(category) {
      const url = {
         'films': process.env.FILMS_URL
      }[category];
      const data = await scrapperService.scrapData(url);
      const modelPreviews = {
         'films': filmPreviews
      }[category];
      const modelDescribtions = {
         'films': filmDescribtions
      }[category];
      console.log(data.describtionsData);
      const reversedPreviews = data.previewsData.reverse();
      const reversedDescribtions = data.describtionsData.reverse();
      const previewsToInsert = reversedPreviews
         .map(async p => {
            const itemFromDb = await modelPreviews.findOne({
               where: {
                  name: p.name,
                  img: p.img
               }
            });
            return itemFromDb ? null : p;
         })
         .filter(p => p);
      const describtionsToInsert = reversedDescribtions
         .map(async d => {
            const itemFromDb = await modelDescribtions.findOne({
               where: {
                  name: d.name,
                  img: d.img
               }
            });
            return itemFromDb ? null : d;
         })
         .filter(d => d);
      const describtions = await modelDescribtions.findAll();
      console.log(describtionsToInsert)
      try {
         previewsToInsert.forEach(async p => {
            const { img, name, genre, year } = await p;
            const preview = modelPreviews.build({
               img, name, genre, year
            });
            preview.save();
         });
   
         describtionsToInsert.forEach(async (d, index) => {
            console.log(d);
            const { img, name, genre, about, duration, year, age } = await d;
            const describtion = modelDescribtions.build({
              img, 
              name, 
              genre, 
              about, 
              duration, 
              year, 
              age, 
              FilmPreviewId: describtions.length+index
            });
            describtion.save();
         });
      } catch (e) { console.log(e) }
   }

   async getPreviewsData(category, page, pageSize, userId) {
      const modelPreviews = {
         'films': filmPreviews
      }[category];

      const modelDetails = {
         'films': filmsDetails
      }[category];
      
      const data = (await modelPreviews.findAll()).reverse();;

      for (let d of data) {
         const ratings = await detailsService.getRatings(category, d.id, userId);
         const details = await detailsService.getUserLikesAndWillWatch(category, d.id, userId);

         d.dataValues.rating = {
            value: ratings.rating,
            voices: ratings.voices,
            prevUserRating: ratings.prevUserRating
         }
         d.dataValues.details = details;   
      }

      const hasMore = data.length > page*pageSize + pageSize + 1;

      return {
         data: data.slice(page*pageSize, page*pageSize + pageSize), 
         hasMore
      };
   }

   async getDescribtionData(category, id) {
      const modelDescribtions = {
         'films': filmDescribtions
      }[category];

      const modelDetails = {
         'films': filmsDetails
      }[category];
      
      const describtion = await modelDescribtions.findOne({
         where: {
            describtionId: id
         }
      });

      return describtion;
   }
}

module.exports = new ContentService();