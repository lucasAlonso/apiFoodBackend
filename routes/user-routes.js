const express = require('express');
const userController = require('../controllers/userController');
const middlewares = require('../middlewares/middlewares');
const api = express.Router();

api.post('/', middlewares.saltHashPassword, userController.postUser);
api.post('/login', middlewares.postLoginCheck, userController.loginUser);

module.exports = api;
