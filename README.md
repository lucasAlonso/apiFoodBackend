# Documentation at:

https://app.swaggerhub.com/apis-docs/lucasAlonso/DelilahResto/1.0

# apiFoodBackend

an excersise using node.js, express and some other well know repos

## Cloning and Runing this repo

1 - Clone and install dependencies:

    git clone https://github.com/lucasAlonso/apiFoodBackend.git
    npm install

2 - run `sqlQueries/createDB.sql` in your Mysql app(workbrench would do it).

    sqlQueries/createDB.sql

3 - Open `config.json` and complete with user and password Mysql's information
`{"user": "tu_usuario", "password": "tu_password" }`

    config.json

4 - run the init app

    node initdDb.js

5 - Run Server:

    nodemon server.js/

6 - server must be runing, fetch endpoint with your fronend.

## Api documentation

[API DOCUMENTATION](https://app.swaggerhub.com/apis-docs/lucasAlonso/DelilahResto/1.0)
