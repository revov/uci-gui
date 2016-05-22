var express = require('express'),
    ensureLoggedIn = require('../passport/ensureLoggedIn');
    Game = require('../models/game'),
    responseObjectHelper = require( '../helpers/responseObjectHelper' );

module.exports = function(passport) {
    var router = express.Router();

    router.get('/:id',
        ensureLoggedIn,
        function(req, res) {
            var user = req.user.toObject();
            Game.findById(req.params.id, function(err, game) {
                if( err ) {
                    res.status(400).json(responseObjectHelper.getNotFoundResponseObject( err.message, err ));
                } else if( !game ) {
                    res.status(400).json(responseObjectHelper.getNotFoundResponseObject( 'Game not found', {} ))
                } else if(!game.uploadedByUserId.equals(user._id)) {
                    res.status(400).json(responseObjectHelper.getNotFoundResponseObject( 'Requested PGN is not for this user', {} ));
                } else {
                    res.status(200).json(responseObjectHelper.getSuccessResponseObject( 'Game found', game ));
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
                        res.status(400).json(responseObjectHelper.getNotFoundResponseObject( err.message, err ));
                    } else {
                        res.status(200).json(responseObjectHelper.getSuccessResponseObject( 'Success', {} ));
                    }
                });
            } else {
                res.status(400).json(responseObjectHelper.getNotFoundResponseObject( 'Invalid id supplied', {} ));
            }
        }
    );

    router.get('/',
        ensureLoggedIn,
        function(req, res) {
            var user = req.user.toObject();
            Game.find({uploadedByUserId : user._id}, '-analysis.moves', function(err, games) {
                if( err ) {
                    res.status(400).json(responseObjectHelper.getNotFoundResponseObject( err.message, err ));
                } else {
                    res.status(200).json(responseObjectHelper.getSuccessResponseObject( 'Success', games ));
                }
            });
        }
    );

    return router;
};