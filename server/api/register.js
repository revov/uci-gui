var express = require('express'),
    responseObjectHelper = require( '../helpers/responseObjectHelper' );

module.exports = function(passport) {
    var router = express.Router();

    router.post('/', passport.authenticate('register'), function(req, res) {
        var user = req.user.toObject();
        delete user.password;

        res.status(200).json(responseObjectHelper.getSuccessResponseObject( 'Success', user ));
    });

    return router;
};