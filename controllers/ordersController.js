const config = require("../config.json");
const db = require("../dbConect");
const { productDbGet } = require("./productsController");

const postOrder = async function createAndPostOrderInDb(req, res) {
    const newOrder = req.body;
    newOrder.idUsuario = req.decodedToken.id;
    let orderReturn = {};
    try {
        orderReturn = await db.query(config.queryPostOrder, { replacements: newOrder });
    } catch (error) {
        console.log("Db Data error", error[0]);
        res.status(500).send("check input data");
    }
    newOrder.id = orderReturn[0];
    newOrder.precioTotal = await makeOrderDetail(newOrder, res);
    let formaPago = await db.query(config.queryGetAlicuota, { replacements: newOrder, type: db.QueryTypes.SELECT });
    newOrder.precioTotal *= formaPago[0].alicuota;
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
        let ordersArray = await db.query(config.queryGetAllOrders, { type: db.QueryTypes.SELECT });
        res.json(ordersArray);
    } catch (error) {
        console.log("Db Data error", error[0]);
        res.status(500).send("check input data");
    }
    let ordersArray = db.query(config.queryGetAllOrders);
};

const getUserOrders = async function (req, res) {
    try {
        console.log(req.decodedToken);
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

const updateStatus = async function (req, res) {
    try {
        req.query.idEstadoNew = req.query.idEstado;
        let oldEstado = await db.query(config.queryGetOrderEstado, {
            replacements: req.query,
            type: db.QueryTypes.SELECT,
        });
        req.query.idEstadoOld = oldEstado[0].idEstado;
        await db.query(config.queryUpdateOrderStatus, { replacements: req.query });
        await db.query(config.queryInsertEstadoDetail, { replacements: req.query });
        res.status(200).send("order status updated");
    } catch (error) {
        console.log("Db Data error", error[0]);
        res.status(500).send("check input data");
    }
};
const getUserOrderDetail = async function (req, res) {
    let order = await getDetail(req.decodedToken.id, req.query.idPedido);
    order.historialEstados = await getStatusHistory(req.query, res);
    res.json(order);
};

const getOrderDetailAdmin = async function (req, res) {
    let order = await getDetail(false, req.query.idPedido, true);
    order.historialEstados = await getStatusHistory(req.query, res);
    res.json(order);
};

const getStatusHistory = async function (objectWithIdPedido, res) {
    try {
        let historyStatus = db.query(config.queryGetOrderEstadoDetail, {
            replacements: objectWithIdPedido,
            type: db.QueryTypes.SELECT,
        });
        return historyStatus;
    } catch (error) {
        console.log("Db Data error", error[0]);
        res.status(500).send("check input data");
    }
};
const getDetail = async function (idUsuario, idPedido, isAdmin) {
    try {
        let detailQuery = isAdmin
            ? [config.queryGetOrder, config.queryGetOrderDetail]
            : [config.queryGetUserOrder, config.queryGetUserOrderDetail];
        let orderDetailInfo = {};
        orderDetailInfo.idUsuario = idUsuario;
        orderDetailInfo.idPedido = idPedido;
        let orderInfo = await db.query(detailQuery[0], {
            replacements: orderDetailInfo,
            type: db.QueryTypes.SELECT,
        });
        let orderDetail = await db.query(detailQuery[1], {
            replacements: orderDetailInfo,
            type: db.QueryTypes.SELECT,
        });
        let orderComplete = {};
        orderComplete.info = orderInfo[0];
        orderComplete.itemDetails = orderDetail;
        return orderComplete;
    } catch (error) {
        console.log("Db Data error", error[0]);
        res.status(500).send("check input data");
    }
};

module.exports = {
    postOrder,
    getAllOrders,
    getUserOrders,
    getUserOrderDetail,
    getOrderDetailAdmin,
    updateStatus,
};
