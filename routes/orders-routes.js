const express = require("express");
const ordersController = require("../controllers/ordersController");
const middlewares = require("../middlewares/middlewares");
const api = express.Router();

api.post("/", middlewares.validateLoginCredentials, ordersController.postOrder);
api.get("/", middlewares.validateLoginCredentials, middlewares.isAdmin, ordersController.getAllOrders);
api.get("/user", middlewares.validateLoginCredentials, ordersController.getUserOrders);

module.exports = api;
