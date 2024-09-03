const { Router } = require('express');
const contentCotroller = require('../controllers/content-controller');

const router = Router();

router.post('/previews', contentCotroller.getPreviewsData);
router.post('/describtion', contentCotroller.getDescribtionData);
router.post('/set-rating', contentCotroller.setRating);
router.post('/set-like', contentCotroller.setLike);
router.post('/set-will-watch', contentCotroller.setWillWatch);
router.post('/get-rating', contentCotroller.getRating);
router.get('/test', contentCotroller.test);

module.exports = router;