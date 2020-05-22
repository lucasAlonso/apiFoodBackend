const config = require("../config.json");
const db = require("../dbConect");
const { productDbGet } = require("./productsController");

const postOrder = async function createAndPostOrderInDb(req, res) {
    const newOrder = req.body;
    let orderReturn = {};
    try {
        orderReturn = await db.query(config.queryPostOrder, { replacements: newOrder });
    } catch (error) {
        console.log("Db Data error", error[0]);
        res.status(500).send("check input data");
    }
    newOrder.id = orderReturn[0];
    newOrder.precioTotal = await makeOrderDetail(newOrder, res);
    try {
        await db.query(config.queryPostAddOrderTotal, { replacements: newOrder });
        res.status(200).send("order taken");
    } catch (error) {
        console.log("Db Data error cannot make order Total", error[0]);
        res.status(500).send("check input data");
    }
};

const makeOrderDetail = async function (newOrder, res) {
    let orderTotalAmount = 0;
    for (const item of newOrder.items) {
        let productDetail = await productDbGet(item, config.queryProductById, true);
        let orderDetail = {};
        orderDetail.idPedido = newOrder.id;
        orderDetail.idProducto = item.idProducto;
        orderDetail.cantProductos = item.cantProductos;
        orderDetail.valorUnitario = productDetail.precio;
        orderDetail.valorTotal = orderDetail.valorUnitario * orderDetail.cantProductos;
        orderTotalAmount += orderDetail.valorTotal;
        console.log(orderTotalAmount, orderDetail.valorTotal, orderDetail.valorUnitario);
        let checkPostOrderStatus = await postOrderDetail(orderDetail);
        if (!checkPostOrderStatus) {
            res.status(500).send("error in Order Detail");
        }
    }
    return orderTotalAmount;
};
const postOrderDetail = async function (orderDetail) {
    try {
        await db.query(config.queryPostOrderDetail, { replacements: orderDetail });
        return true;
    } catch (error) {
        console.log("Db Data error", error[0]);
        return false;
    }
};

const getAllOrders = async function (req, res) {
    try {
        let ordersArray = await db.query(config.queryGetAllOrders);
        res.json(ordersArray);
    } catch (error) {
        console.log("Db Data error", error[0]);
        res.status(500).send("check input data");
    }
    let ordersArray = db.query(config.queryGetAllOrders);
};

const getUserOrders = async function (req, res) {
    try {
        let orderTaken = await db.query(config.queryGetUserOrders, {
            replacements: req.decodedToken,
            type: db.QueryTypes.SELECT,
            raw: true,
        });
        res.json(orderTaken);
    } catch (error) {
        console.log("Db Data error", error[0]);
        res.status(500).send("check input data");
    }
};

module.exports = {
    postOrder,
    getAllOrders,
    getUserOrders,
};
