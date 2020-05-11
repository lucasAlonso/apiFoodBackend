const express = require('express');
const userController = require('../controllers/userController');
const middlewares = require('../middlewares/middlewares');
const api = express.Router();

api.post('/', middlewares.saltHashPassword, userController.postUser);
api.post('/login', middlewares.postLoginCheck, userController.loginUser);
api.get('/', middlewares.postLoginCheck, userController.getUser);
api.get('/all', middlewares.validateLoginCredentials, middlewares.isAdmin, userController.getAllUsers);
module.exports = api;
