const contentService = require('../services/content-service');
const detailsService = require('../services/details-service');

class ContentController {

   async getPreviewsData(req, res, next) {
      try {
         const { category, page, pageSize, userId } = req.body;
         const data = await contentService.getPreviewsData(category, page, pageSize, userId);
         return res.json(data);
      } catch(e) {
         next(e);
      }
   }

   async getDescribtionData(req, res, next) {
      try {
         const { category , id } = req.body;
         const data = await contentService.getDescribtionData(category, id);
         return res.json(data);
      } catch(e) {
         next(e);
      }
   }

   async setRating(req, res, next) {
      try {
         const {category, userId, itemId, rating} = req.body;
         const data = await detailsService.setRatings(itemId, userId, rating, category);
         return res.json(data);
      } catch(e) {
         next(e);
      }
   }

   async setLike(req, res, next) {
      try {
         const { category, itemId, userId } = req.body;
         const data = await detailsService.setIsLiked(itemId, userId, category);
         return res.json(data);
      } catch(e) {
         next(e);
      }
   }

   async setWillWatch(req, res, next) {
      try {
         const { category, itemId, userId } = req.body;
         const data = await detailsService.setWillWatch(itemId, userId, category);
         return res.json(data);
      } catch(e) {
         next(e);
      }
   }

   async getRating(req, res, next) {
      try {
         const { itemId } = req.body;
         const data = await detailsService.getRatings('films', itemId);
         return res.json(data);
      } catch(e) {
         next(e);
      }
   }

   async test(req, res, next) {
      try {
         await contentService.dataToDatabase('films');
      } catch(e) {
         next(e);
      }
      

   }
}

module.exports = new ContentController();