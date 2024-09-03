const { filmsDetails } = require('../models');
const { where, Op } = require('sequelize');
const FilmPreviews = require('../models/FilmPreviews');
const ApiError = require('../exceptions/api-errors');

class DetailsService {
   
   async details(category, itemId, userId) {
      if (!userId) throw ApiError.UnauthorizedError();

      const model = {
         'films': filmsDetails
      }[category];

      const details = await model.findOne({
         where: {
            filmId: itemId,
            userId: userId 
         }
      });

      if (details) return details;

      const newDetails = model.build({
         filmId: itemId,
         userId: userId,
         isLiked: false,
         willWatch: false,
         rating: null
      })

      return newDetails;
   }

   async setRatings(itemId, userId, rating, category) {
      const details = await this.details(category, itemId, userId);
      details.rating = rating;
      details.save();
      return true;
   }

   async setIsLiked (itemId, userId, category) {
      const details = await this.details(category, itemId, userId);
      details.isLiked = !details.isLiked;
      details.save();
      return true;
   }

   async setWillWatch(itemId, userId, category) {
      const details = await this.details(category, itemId, userId);
      details.willWatch = !details.willWatch;
      details.save();
      return true;
   }

   async getRatings(category, itemId, userId) {
      const model = {
         'films': filmsDetails
      }[category];

      const where = {
         'films': {filmId: itemId, rating: {[Op.ne]: null}}
      }[category];

      const ratings = await model.findAll({
         where: where
      });

      const prevUserRating = ratings.find(item => item.userId === userId)?.rating || -1;

      return {
         rating: ratings.reduce((sum, item) => sum + item.rating, 0) / ratings.length || 0,
         voices: ratings.filter(item => item).length || 0,
         prevUserRating
      }
   }

   async getUserLikesAndWillWatch(category, itemId, userId) {
      const model = {
         'films': filmsDetails
      }[category];

      const where = {
         'films': {
            filmId: itemId,
            userId: userId
         }
      }[category];
      
      const data = await model.findOne({
         where: where
      });

      return data;
   }
}

module.exports = new DetailsService();