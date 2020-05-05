const config = require('../config.json');
const db = require('../dbConect');

let postProducts = async function (req, res) {
    const newProduct = req.body;
    let productExist = await productDbCheck(newProduct);
    if (!productExist) {
        try {
            await db.query(config.queryPostProduct, { replacements: newProduct });
            res.status(201).send('Product Stored');
        } catch (error) {
            console.log('Db Data error', error[0]);
            res.status(500).send('check input data');
        }
    } else res.status(401).send('Product exists');
};
const productDbCheck = async function checkIfProductExistInDb(product) {
    let dbCheck = await db.query(config.queryProduct, {
        replacements: product,
        type: db.QueryTypes.SELECT,
        raw: true,
    });
    let check = dbCheck[0] ? true : false;
    return check;
};
module.exports = {
    postProducts,
};
