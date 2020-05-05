const Sequelize = require('sequelize');
const config = require('./config.json');

module.exports = new Sequelize('delilah', config.user, config.password, {
    host: 'localhost',
    dialect: 'mysql',
});
