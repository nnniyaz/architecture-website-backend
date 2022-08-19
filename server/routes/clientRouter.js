const Router = require('express');
const { body } = require('express-validator');
const clientController = require('../controllers/clientController');
const router = new Router();

router.post('/client',
    body('email').isEmail(),
    clientController.createClient
);
router.get('/clients', clientController.getAllClients);
router.delete('/delete', clientController.deleteClient);

module.exports = router;