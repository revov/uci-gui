var express = require('express');

module.exports = function(passport) {
    var router = express.Router();

    router.post('/', function(req, res) {
        req.logout();
        req.session.destroy();
        res.end();
    });

    return router;
};