const express = require('express');
const productsController = require('../controllers/productsController');
const middlewares = require('../middlewares/middlewares');
const api = express.Router();

api.post('/', middlewares.validateLoginCredentials, middlewares.isAdmin, productsController.postProducts);
api.get('/', middlewares.validateLoginCredentials, productsController.getProduct);
api.patch('/', middlewares.validateLoginCredentials, middlewares.isAdmin, productsController.updateProduct);
api.delete('/', middlewares.validateLoginCredentials, middlewares.isAdmin, productsController.deleteProduct);

module.exports = api;
