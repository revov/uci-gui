var express = require('express'),
    ensureLoggedIn = require('../passport/ensureLoggedIn'),
    responseObjectHelper = require( '../helpers/responseObjectHelper' );

module.exports = function(passport) {
    var router = express.Router();

    router.post(
        '/',
        ensureLoggedIn,
        function(req, res) {
            var user = req.user;
            user.preferences = req.body;

            user.save(function(err) {
                if(err) {
                    res.status(400).json(responseObjectHelper.getNotFoundResponseObject( err.message, err ))
                } else {
                    var userObj = user.toObject();
                    delete userObj.password;

                    res.status(200).json(responseObjectHelper.getSuccessResponseObject( 'Success', userObj ));
                }
            });
        }
    );

    return router;
};