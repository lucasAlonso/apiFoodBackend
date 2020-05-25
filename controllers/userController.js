const config = require("../config.json");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const db = require("../dbConect");

let postUser = async function (req, res) {
    const newUser = req.body;
    await userDbCheck(req, res);
    if (!req.body.userDbTaken) {
        try {
            await db.query(config.queryPostUser, { replacements: newUser });
            res.status(201).send("user Created");
        } catch (error) {
            console.log("Db Data error", error[0]);
            res.status(500).send("check input data");
        }
    } else res.status(401).send("User already taken");
};

const userDbCheck = async function checkIfUserExistInDb(req, res) {
    const userReq = req.body;
    let checked = await db.query(config.queryDbUser, {
        replacements: userReq,
        type: db.QueryTypes.SELECT,
        raw: true,
    });
    req.body.userDbTaken = checked[0] ? true : false;
};

const loginUser = async function loginUserAndReturnJWToken(req, res) {
    if (req.isPasswordCorrect) {
        let tokenSigned = { token: signToken(req.userFromDb) };
        res.status(202).json(tokenSigned);
    } else {
        res.status(404).send("Password Incorrecto");
    }
};

const getUser = async function (req, res) {
    let userFromDb = await db.query(config.queryDbUser, {
        replacements: req.decodedToken,
        type: db.QueryTypes.SELECT,
        raw: true,
    });
    const userToReturn = cropUserInfo(userFromDb[0]);
    res.status(200).json(userToReturn);
};

const getAllUsers = async function (req, res) {
    try {
        let users = await db.query(config.queryAllDbUser, {
            type: db.QueryTypes.SELECT,
            raw: true,
        });
        res.status(200).json(users);
    } catch (error) {
        console.log("Db Data error", error[0]);
        res.status(500).send("check input data");
    }
};

const signToken = function signTokenUsingJsonWebToken({ id, usuario, administ }) {
    let contenido = {
        id: id,
        usuario: usuario,
        administ: administ[0],
    };
    return jwt.sign(contenido, config.firma);
};

const cropUserInfo = function (user) {
    const { hysPass, salt, activo, administ, ...newUser } = user;
    return newUser;
};
module.exports = {
    postUser,
    loginUser,
    getUser,
    getAllUsers,
};
