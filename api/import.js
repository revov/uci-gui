var express = require('express');
var ensureLoggedIn = require('../passport/ensureLoggedIn');
var Game = require('../models/game.js');

module.exports = function(passport) {
    var router = express.Router();

    router.post('/',
        ensureLoggedIn,
        function(req, res) {
            var user = req.user.toObject();
            if(req.body && req.body.pgnContent) {
                var newGame = new Game({pgn: req.body.pgnContent, white: 'N/A', black: 'N/A', uploadedByUserId: user._id, 'analysis.status': 'Pending'});
                newGame.save(function (err) {
                            if (err) {
                                res.status(400).json(err);
                            } else {
                                res.status(201).json(newGame);
                            }
                        });
            } else {
                res.status(400).json({message: 'Empty PGN'});
            }
        }
    );

    return router;
};