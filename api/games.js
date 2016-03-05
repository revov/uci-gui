var express = require('express');
var ensureLoggedIn = require('../passport/ensureLoggedIn');
var Game = require('../models/game');

module.exports = function(passport) {
    var router = express.Router();

    router.get('/:id',
        ensureLoggedIn,
        function(req, res) {
            var user = req.user.toObject();
            Game.findById(req.params.id, function(err, game) {
                if( err ) {
                    res.status(400).json(err);
                } else if(game.uploadedByUserId !== user._id) {
                    res.status(400).json({message: 'Requested PGN is not for this user'});
                } else {
                    res.status(200).json(game);
                }
            });
        }
    );

    router.get('/',
        ensureLoggedIn,
        function(req, res) {
            var user = req.user.toObject();
            Game.find({uploadedByUserId : user._id}, '-analysis.moves', function(err, games) {
                if( err ) {
                    res.status(400).json(err);
                } else {
                    res.status(200).json(games);
                }
            });
        }
    );

    return router;
};