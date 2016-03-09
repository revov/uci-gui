var express = require('express');
var ensureLoggedIn = require('../passport/ensureLoggedIn');

module.exports = function(passport) {
    var router = express.Router();

    router.get('/',
        ensureLoggedIn,
        function(req, res) {
            var user = req.user.toObject();
            delete user.password;

            res.json(user);
        }
    );

    return router;
};