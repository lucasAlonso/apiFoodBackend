const express = require("express");
const ordersController = require("../controllers/ordersController");
const middlewares = require("../middlewares/middlewares");
const api = express.Router();

api.post("/", middlewares.validateLoginCredentials, ordersController.postOrder);
api.get("/", middlewares.validateLoginCredentials, middlewares.isAdmin, ordersController.getAllOrders);
api.get("/detail", middlewares.validateLoginCredentials, middlewares.isAdmin, ordersController.getOrderDetailAdmin);
api.get("/user", middlewares.validateLoginCredentials, ordersController.getUserOrders);
api.get("/user/detail", middlewares.validateLoginCredentials, ordersController.getUserOrderDetail);
api.patch("/estado", middlewares.validateLoginCredentials, middlewares.isAdmin, ordersController.updateStatus);
api.delete("/", middlewares.validateLoginCredentials, middlewares.isAdmin, ordersController.deleteOrder);

module.exports = api;
