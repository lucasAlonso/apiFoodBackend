const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const config = require('./config.json');

const user_routes = require('./routes/user-routes');
const products_routes = require('./routes/products-routes');

app.use(cors({ origin: '*' }), bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/user', user_routes);
app.use('/products', products_routes);

module.exports = app;
