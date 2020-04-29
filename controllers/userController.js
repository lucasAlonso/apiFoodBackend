const config = require('../config.json');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.mysqlurl);
const jwt = require('jsonwebtoken');

let postUser = async function (req, res) {
    const newUser = req.body;
    req.body.userDbTaken = 'false';
    userDbCheck(req, res);
    console.log(req.body.userDbTaken);
    if (!req.body.userDbTaken) {
        try {
            await sequelize.query(config.queryPostUser, { replacements: newUser });
            res.status(201).send('user Created');
        } catch (error) {
            console.log('Db Data error', error[0]);
            res.status(500).send('check input data');
        }
    } else res.status(401).send('User already taken');
};

const userDbCheck = async function checkIfUserExistInDb(req, res) {
    const userReq = req.body;
    let checked = await sequelize.query(config.queryDbCheck, {
        replacements: userReq,
        type: Sequelize.QueryTypes.SELECT,
        raw: true,
    });
    req.body.userDbTaken = checked[0] ? true : false;
};

const quitIfUserExist = function returnErrorIfUserExistInDb(req, res) {
    if (req.body.userDbTaken) {
        res.status(401).send('Usuario existe en DB');
    }
};

module.exports = {
    postUser,
};
