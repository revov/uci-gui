var express = require('express');

module.exports = function(passport, socketioService) {
    var router = express.Router();

    router.use('/login', require('./login')(passport));
    router.use('/register', require('./register')(passport));
    router.use('/logout', require('./logout')(passport, socketioService));
    router.use('/user', require('./user')(passport));
    router.use('/games', require('./games')(passport, socketioService));
    router.use('/import', require('./import')(passport, socketioService));

    return router;
};