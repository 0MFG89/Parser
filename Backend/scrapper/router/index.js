const { Router } = require('express');
const contentCotroller = require('../controllers/content-controller');

const router = Router();

router.post('/previews', contentCotroller.getPreviewsData);
router.post('/describtion', contentCotroller.getDescribtionData);
router.get('/test', contentCotroller.test);

module.exports = router;