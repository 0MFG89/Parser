const contentService = require('../services/content-service');

class ContentController {

   async getPreviewsData(req, res, next) {
      try {
         const { category } = req.body;
         const data = await contentService.getPreviewsData(category);
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
}

module.exports = new ContentController();