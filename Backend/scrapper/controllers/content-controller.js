const contentService = require('../services/content-service');

class ContentController {

   async getPreviewsData(req, res, next) {
      try {
         const { category, page, pageSize } = req.body;
         const data = await contentService.getPreviewsData(category, page, pageSize);
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

   async test(req, res, next) {
      try {
         await contentService.dataToDatabase('films');
      } catch (e) {
         next(e);
      }
   }
}

module.exports = new ContentController();