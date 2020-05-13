const Sequelize = require("sequelize");
const config = require("./config.json");
const crypto = require("crypto");
const userList = require("./sqlQuerys/listaUsuarios.json");
const productList = require("./sqlQuerys/listaProductos.json");
const estados = require("./sqlQuerys/estados.json");
const formaPago = require("./sqlQuerys/formaPago.json");

db = new Sequelize("delilah", config.user, config.password, {
    host: "localhost",
    dialect: "mysql",
    logging: false,
});

let postUser = async function (newUser) {
    saltHashPassword(newUser);
    newUser.activo = 1;
    newUser.administ = 0;
    try {
        await db.query(config.queryPostUser, { replacements: newUser });
    } catch (error) {
        console.log("Db Data error", error[0]);
    }
};
let postProducts = async function (newProduct) {
    try {
        await db.query(config.queryPostProduct, { replacements: newProduct });
    } catch (error) {
        console.log("Db Data error", error[0]);
        res.status(500).send("check input data");
    }
};

let postEstados = async function (newEstado) {
    try {
        await db.query("INSERT INTO estados (estado) values(:estado)", { replacements: newEstado });
    } catch (error) {
        console.log("Db Data error", error[0]);
        res.status(500).send("check input data");
    }
};

let postFormaPago = async function (newFormaPago) {
    try {
        await db.query("INSERT INTO formaPago (descrip,alicuota) values(:descrip,:alicuota)", {
            replacements: newFormaPago,
        });
    } catch (error) {
        console.log("Db Data error", error[0]);
        res.status(500).send("check input data");
    }
};
const genRandomString = function (length) {
    return crypto
        .randomBytes(Math.ceil(length / 2))
        .toString("hex")
        .slice(0, length);
};

const sha512 = function (password, salt) {
    var hash = crypto.createHmac("sha512", salt);
    hash.update(password);
    var value = hash.digest("hex");
    return {
        salt: salt,
        passwordHash: value,
    };
};

const saltHashPassword = function encryptPassordWithHashAndSaltMethod(newUser) {
    let salt = genRandomString(16);
    let passwordData = sha512(newUser.plainPass, salt);
    newUser.hysPass = passwordData.passwordHash;
    newUser.salt = passwordData.salt;
    newUser.plainPass = null;
};

userList.forEach((user) => {
    postUser(user);
});

productList.forEach((product) => {
    postProducts(product);
});
estados.forEach((estado) => {
    postEstados(estado);
});
formaPago.forEach((formaPago) => {
    postFormaPago(formaPago);
});
