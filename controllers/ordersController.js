const config = require("../config.json");
const db = require("../dbConect");

const postOrder = async function createAndPostOrderInDb(req, res) {
    const newOrder = req.body;
    try {
        let orderReturn = await db.query(config.queryPostOrder, { replacements: newOrder });
    } catch (error) {
        console.log("Db Data error", error[0]);
        res.status(500).send("check input data");
    }
    newOrder.id = orderReturn[0];
    await makeOrderDetail(newOrder);
};

const makeOrderDetail = async function (newOrder) {};
const postOrderDetail = async function (item) {};
module.exports = {
    postOrder,
};
