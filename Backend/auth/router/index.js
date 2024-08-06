const { Router } = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/user-controller');
const authMiddleware = require('../middlewares/auth-middleware');

const router = Router();

router.post('/login', userController.login);
router.post('/registration', 
   body('email').isEmail(), 
   body('password').isLength({min: 7, max: 32}),
   userController.registration
);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activation);
router.get('/refresh', userController.refresh);

module.exports = router;
