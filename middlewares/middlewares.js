const crypto = require('crypto');
const config = require('../config.json');
const db = require('../dbConect');

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
    let userFromDb = await db.query(config.queryDbUser, {
        replacements: req.body,
        type: db.QueryTypes.SELECT,
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
    let passwordData = sha512(passwordAttempt, savedSalt);
    return savedHash == passwordData.passwordHash;
};
const isAdmin = function validateIfAnUserIsAdmin(req, res, next) {
    const decodificado = req.decodedToken;
    if (decodificado.administ) {
        next();
    } else res.status(403).send('User dont have permission');
};

const validateLoginCredentials = function (req, res, next) {
    const decodificado = validateToken(req.headers.authorization.split(' ')[1]);
    if (decodificado) {
        req.decodedToken = decodificado;
        next();
    } else {
        return res.status(403).send('Token invalid');
    }
};

const validateToken = function validateAndReturnDecodedToken(token) {
    const decodificado = jwt.verify(token, config.firma);
    return decodificado;
};

module.exports = {
    saltHashPassword,
    postLoginCheck,
    isAdmin,
    validateLoginCredentials,
};
