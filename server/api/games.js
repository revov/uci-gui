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
                } else if(!game.uploadedByUserId.equals(user._id)) {
                    res.status(400).json({message: 'Requested PGN is not for this user'});
                } else {
                    res.status(200).json(game);
                }
            });
        }
    );

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