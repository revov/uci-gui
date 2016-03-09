var express = require('express');

module.exports = function(passport, socketIO) {
    var router = express.Router();

    router.use('/login', require('./login')(passport));
    router.use('/register', require('./register')(passport));
    router.use('/logout', require('./logout')(passport));
    router.use('/user', require('./user')(passport));
    router.use('/games', require('./games')(passport, socketIO));
    router.use('/import', require('./import')(passport, socketIO));

    return router;
};