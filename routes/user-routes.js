const express = require('express');
const UserController = require('../controllers/userController');
const Middlewares = require('../middlewares/middlewares');
const api = express.Router();

api.post('/', Middlewares.saltHashPassword, UserController.postUser);
api.post('/login', Middlewares.postLoginCheck, UserController.loginUser);
module.exports = api;
