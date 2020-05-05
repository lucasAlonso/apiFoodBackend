const server = require('./app');
const config = require('./config.json');
const db = require('./dbConect');

db.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

server.listen(config.port, () => console.log(`server running on port ${config.port}`));
