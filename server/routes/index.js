const Router = require('express');
const router = new Router();
const userRouter = require('./userRouter');
const clientRouter = require('./clientRouter');

router.use('/user', userRouter)
router.use('/client', clientRouter)


module.exports = router;