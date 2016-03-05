var express = require('express'),
    ensureLoggedIn = require('../passport/ensureLoggedIn'),
    Game = require('../models/game');

module.exports = function(passport) {
    var router = express.Router();

    router.delete('/:id',
        ensureLoggedIn,
        function(req, res) {
            var user = req.user.toObject();
            if(req.params.id) {
                Game.remove({_id: req.params.id, uploadedByUserId: user._id }, function(err) {
                    if(err) {
                        res.status(400).json(err);
                    } else {
                        res.status(200).json({message: 'Success'});
                    }
                });
            } else {
                res.status(400).json({message: 'Invalid id supplied'});
            }
        }
    );

    return router;
};