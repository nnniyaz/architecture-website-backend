const Router = require('express');
const router = new Router();
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const roleMiddleware = require('../middlewares/checkRoleMiddleware');

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({ min: 3, max: 32 }),
    userController.registration
);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', roleMiddleware('ADMIN'), userController.getUsers);


module.exports = router;