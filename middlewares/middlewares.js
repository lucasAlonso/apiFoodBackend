const crypto = require('crypto');
const config = require('../config.json');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.mysqlurl, {
    raw: false,
});

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
    var salt = genRandomString(16);
    let passwordData = sha512(req.body.plainPass, salt);
    req.body.hysPass = passwordData.passwordHash;
    req.body.salt = passwordData.salt;
    req.body.plainPass = null;
    next();
};
const userPostValidate = function userJsonFromRequestValidation(req, res, next) {
    next();
};

module.exports = {
    saltHashPassword,
    userPostValidate,
};

//https://www.freecodecamp.org/news/handling-front-end-encryption-using-openpgp-3b0462bf5876/ para encriptar de front to end
