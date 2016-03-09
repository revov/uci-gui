var express = require('express');

module.exports = function(passport) {
    var router = express.Router();

    router.post('/', passport.authenticate('login'), function(req, res) {
        var user = req.user.toObject();
        delete user.password;

        res.json(user);
    });

    return router;
};