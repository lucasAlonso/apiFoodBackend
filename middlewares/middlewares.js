const crypto = require('crypto');
const config = require('../config.json');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.mysqlurl, {
    raw: false,
});

const jwt = require('jsonwebtoken');
const genRandomString = function (length) {
    return crypto
        .randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
};

const sha512 = function (password, salt) {
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt: salt,
        passwordHash: value,
    };
};

const saltHashPassword = function encryptPassordWithHashAndSaltMethod(req, res, next) {
    let salt = genRandomString(16);
    let passwordData = sha512(req.body.plainPass, salt);
    req.body.hysPass = passwordData.passwordHash;
    req.body.salt = passwordData.salt;
    req.body.plainPass = null;
    next();
};
const postLoginCheck = async function (req, res, next) {
    console.log(req.body.usuario);
    let userFromDb = await sequelize.query(config.queryDbUser, {
        replacements: req.body,
        type: Sequelize.QueryTypes.SELECT,
        raw: true,
    });

    if (userFromDb) {
        req.userFromDb = userFromDb[0];
        req.isPasswordCorrect = validatePassword(req.userFromDb.hysPass, req.userFromDb.salt, req.body.plainPass);
        next();
    } else {
        res.status(401).send('Usuario no existe en DB');
    }
};
const validatePassword = function checkIfPasswordCorrect(savedHash, savedSalt, passwordAttempt) {
    console.log(passwordAttempt, savedHash, savedSalt);
    let passwordData = sha512(passwordAttempt, savedSalt);
    return savedHash == passwordData.passwordHash;
};
const isAdmin = function validateIfAnUserIsAdmin(req, res, next) {
    const token = req.headers.authorization.split(' ')[1];
    const decodificado = jwt.verify(token, config.firma);
    console.log(decodificado);
    console.log(token);
    if (decodificado.administ) {
        next();
    } else res.status(403).send('User dont have permission');
};
module.exports = {
    saltHashPassword,
    postLoginCheck,
    isAdmin,
};

//https://www.freecodecamp.org/news/handling-front-end-encryption-using-openpgp-3b0462bf5876/ para encriptar de front to end
