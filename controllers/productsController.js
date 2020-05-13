const config = require("../config.json");
const db = require("../dbConect");

let postProducts = async function(req, res) {
    const newProduct = req.body;
    let productExist = await productDbCheck(newProduct);
    if (!productExist) {
        try {
            await db.query(config.queryPostProduct, { replacements: newProduct });
            res.status(201).send("Product Stored");
        } catch (error) {
            console.log("Db Data error", error[0]);
            res.status(500).send("check input data");
        }
    } else res.status(401).send("Product exists");
};

const productDbCheck = async function checkIfProductExistInDb(product) {
    let dbCheck = await db.query(config.queryProduct, {
        replacements: product,
        type: db.QueryTypes.SELECT,
        raw: true
    });
    let check = dbCheck[0] ? (dbCheck[0].activo ? true : false) : false;
    return check;
};

const getProduct = async function getProductFromDb(req, res) {
    let sqlQuery = getSqlGetQuery(req);
    try {
        let product = await productDbGet(req.query, sqlQuery);
        choseGetResponse(product, res);
    } catch (error) {
        console.log("Db Data error", error[0]);
        res.status(500).send("Check query data");
    }
};

const productDbGet = async function(productName, queryDb) {
    let product = await db.query(queryDb, {
        replacements: productName,
        type: db.QueryTypes.SELECT,
        raw: true
    });
    if (typeof productName.nombre !== "undefined") {
        return product[0] ? (product[0].activo[0] ? product[0] : "inactive") : false;
    } else {
        return product;
    }
};

const getSqlGetQuery = function(req) {
    let sqlQuery = req.query.hasOwnProperty("nombre") ? config.queryProduct : config.queryAllProducts;
    if (req.query.hasOwnProperty("onlyActivos")) {
        sqlQuery = req.query.onlyActivos === "true" ? sqlQuery + " WHERE activo = 1" : sqlQuery;
    }
    return sqlQuery;
};

const choseGetResponse = function(product, res) {
    if (product === "inactive") {
        return res.status(404).send("Product Erased from DB");
    } else if (product) {
        return res.status(200).json(product);
    } else {
        return res.status(404).send("Product does not exist");
    }
};

const updateProduct = async function(req, res) {
    let productUpdate = req.body;
    const filteredKeysToUpdate = filterKeys(productUpdate);
    let sqlQuery = createUpdateQuery(filteredKeysToUpdate);
    try {
        await db.query(sqlQuery, {
            replacements: productUpdate,
            raw: true
        });
        res.status(200).send("Product Updated");
    } catch (error) {
        console.log("Db Data error", error[0]);
        res.status(500).send("check input data");
    }
};

const filterKeys = function filterKeysWhitDbTableModel(product) {
    const keys = Object.keys(product);
    const keysOfProductDb = ["nombre", "descripcion", "precio", "categoria", "img_url"];
    const filteredKeys = keys.filter(value => keysOfProductDb.includes(value));
    return filteredKeys;
};

const createUpdateQuery = function(keysToUpdate) {
    let sqlQuery = "UPDATE productos SET ";
    for (const key in keysToUpdate) {
        sqlQuery += keysToUpdate[key] + " = :" + keysToUpdate[key] + ", ";
    }
    let sqlQuerySliced = sqlQuery.slice(0, -2);
    sqlQuerySliced += " WHERE id = :id;";
    return sqlQuerySliced;
};

const deleteProduct = async function(req, res) {
    try {
        await db.query(config.deleteProduct, {
            replacements: req.query,
            raw: true
        });
        res.status(200).send("Product Erased");
    } catch (error) {
        console.log("Db Data error", error[0]);
        res.status(500).send("check input data");
    }
};

module.exports = {
    postProducts,
    getProduct,
    updateProduct,
    deleteProduct
};
