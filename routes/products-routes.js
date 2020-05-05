const express = require('express');
const ProductsController = require('../controllers/productsController');
const Middlewares = require('../middlewares/middlewares');
const api = express.Router();

api.post('/', Middlewares.validateLoginCredentials, ProductsController.postProducts);

module.exports = api;
