const express = require("express");
const ordersController = require("../controllers/ordersController");
const middlewares = require("../middlewares/middlewares");
const api = express.Router();

api.post("/", ordersController.postOrder);

module.exports = api;
