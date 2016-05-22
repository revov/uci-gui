var express = require('express'),
    ensureLoggedIn = require('../passport/ensureLoggedIn'),
    Game = require('../models/game'),
    analyzer = require('../services/analyze'),
    Chess = require('chess.js').Chess,
    responseObjectHelper = require( '../helpers/responseObjectHelper' );

module.exports = function(passport, socketioService) {
    var router = express.Router();

    router.post('/',
        ensureLoggedIn,
        function(req, res) {
            var user = req.user.toObject();
            if(req.body && req.body.pgnContent) {
                var chess = new Chess();

                // load the pgn
                if( chess.load_pgn(req.body.pgnContent) ) {
                    var pgnHeader = chess.header(),
                        newGame = new Game({
                                        pgn: req.body.pgnContent,
                                        uploadedByUserId: user._id,
                                        white: pgnHeader.White,
                                        whiteElo: pgnHeader.WhiteElo,
                                        black: pgnHeader.Black,
                                        blackElo: pgnHeader.BlackElo,
                                        site: pgnHeader.Site,
                                        datePlayed: pgnHeader.Date,
                                        round: pgnHeader.Round,
                                        event: pgnHeader.Event,
                                        result: pgnHeader.Result
                                  });
                    newGame.save(function (err) {
                                if (err) {
                                    res.status(400).json(responseObjectHelper.getNotFoundResponseObject( err.message, err ));
                                } else {
                                    res.status(201).json(responseObjectHelper.getCreatedResponseObject( 'Game saved', newGame ));
                                    analyzer.analyze(newGame, Game, chess, socketioService.socketIO.of('game'));
                                }
                            });
                } else {
                    res.status(400).json(responseObjectHelper.getNotFoundResponseObject( 'Could not parse provided pgn', {} ));
                }
            } else {
                res.status(400).json(responseObjectHelper.getNotFoundResponseObject( 'Empty PGN', {} ));
            }
        }
    );

    return router;
};