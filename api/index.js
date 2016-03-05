var express = require('express');

module.exports = function(passport) {
    var router = express.Router();

    router.use('/login', require('./login')(passport));
    router.use('/register', require('./register')(passport));
    router.use('/logout', require('./logout')(passport));
    router.use('/user', require('./user')(passport));
    router.use('/games', require('./games')(passport));
    router.use('/import', require('./import')(passport));
    router.use('/delete', require('./delete')(passport));

    return router;
};