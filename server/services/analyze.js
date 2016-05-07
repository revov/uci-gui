'use strict';

var Engine = require('uci'),
    engineConfig = require('../config/engine'),
    constants = require('../constants/constants');

function getLANMove(move) {
    var lanMove = '';
    lanMove += move.from + move.to;
    if(move.promotion) {
        lanMove += move.promotion;
    }

    return lanMove;
};

function convertPGNToLAN(movesArray) {
    var movesToReturn = [];
    var movesCount = movesArray.length;

    for(var i = 0; i < movesCount; i++) {
        movesToReturn.push( getLANMove(movesArray[i]) );
    }

    return movesToReturn;
};

function startAnalizing(game, gameModel, chess, socketioGameNamespace, engine) {
    // convert the pgn notation to long algebraic notation
    var moves = convertPGNToLAN(chess.history({verbose: true}));
    if(!moves.length) {
        console.log('Game contains no moves');
        return;
    }

    var movesCount = moves.length;
    if( chess.in_checkmate() || chess.in_stalemate() || chess.in_threefold_repetition() || chess.insufficient_material() ) {
        movesCount -= 1;
    }

    var updateCriteria = {_id: game._id};

    var promiseChain = engine.runProcess()
                        .then(function() {
                            return gameModel.update(
                                    updateCriteria,
                                    { $set: { 'analysis.status': constants.StatusTypes.Analyzing }}
                                ).exec(function(err, res) {
                                        if(err) {
                                            socketioGameNamespace.to(game._id).emit('error', { message: 'Error setting status' });
                                            socketioGameNamespace.leave(game._id);
                                        } else {
                                            socketioGameNamespace.to(game._id).emit('progress', { status: constants.StatusTypes.Analyzing, progress: 0 });
                                        }
                                    });
                        }).then(function () {
                            // Started
                            return engine.uciCommand();
                        }).then(function (idAndOptions) {
                            // Engine name
                            return engine.isReadyCommand();
                        }).then(function () {
                            // Ready
                            return engine.uciNewGameCommand();
                        });
    // loop over the moves and build the promise chain
    var currentMove = '';
    for(var i = 0; i < movesCount; ++i) {
        currentMove += ' ' + moves[i];
        let currentPosition = currentMove;
        let currentScore = {};
        let currentMoveIndex = i;
        promiseChain = promiseChain.then(function () {
                        // Position set
                        return engine.positionCommand('startpos', currentPosition.trim());
                    }).then(function () {
                        // Starting analysis
                        return engine.goInfiniteCommand(function infoHandler(info) {
                            let matches = info.match(constants.Analyze.ScoreRegex);
                            if(matches && matches[1] && matches[2] ) {
                                if(matches[1] === 'mate' ) {
                                    currentScore.mate = matches[2];
                                    currentScore.cp = constants.NotAvailable;
                                } else if(matches[1] === 'cp' ) {
                                    currentScore.mate = constants.NotAvailable;

                                    // The cp score is given from the engine's perspective.
                                    // If it is white's turn we should negate the score.
                                    let whiteToMove = ( currentMoveIndex%2 == 0 );
                                    if( whiteToMove ) {
                                        currentScore.cp = -parseInt(matches[2]);
                                    } else {
                                        currentScore.cp = matches[2];
                                    }
                                } else {
                                    // case for lowerbound and upperbound
                                    currentScore.mate = constants.NotAvailable;
                                    currentScore.cp = constants.NotAvailable;
                                }
                            }
                        });
                    }).delay(constants.Analyze.Delay)
                    .then(function () {
                        // Stopping analysis
                        return engine.stopCommand();
                    }).then(function (bestmove) {
                        let currentProgress = Math.round( (currentMoveIndex+1) / movesCount * 100 );
                        return gameModel.update(
                                    updateCriteria,
                                    {
                                        $push: {
                                            'analysis.moves': {
                                                bestMove: bestmove.from + ' ' + bestmove.to,
                                                'score.cp': currentScore.cp,
                                                'score.mate': currentScore.mate
                                             }
                                        },
                                        $set: { 'analysis.progress': currentProgress }
                                    }
                                ).exec(function(err, res) {
                                        if(err) {
                                            socketioGameNamespace.to(game._id).emit('error', { message: 'Error analyzing game' });
                                            socketioGameNamespace.leave(game._id);
                                        } else {
                                            socketioGameNamespace.to(game._id).emit('progress', { status: constants.StatusTypes.Analyzing, progress: currentProgress });
                                        }
                                    });
                    });
    }

    promiseChain.then(function () {
                // Stopping engine
                return engine.quitCommand();
            }).then(function () {
                return gameModel.update(
                            updateCriteria,
                            { $set: { 'analysis.status': constants.StatusTypes.Complete }}
                       ).exec(function(err, res) {
                                if(err) {
                                    socketioGameNamespace.to(game._id).emit('error', { message: 'Error setting status' });
                                } else {
                                    socketioGameNamespace.to(game._id).emit('progress', { status: constants.StatusTypes.Complete, progress: 100 });
                                }
                            });
            }).fail(function (error) {
                console.error('Error:', error);
                // Stopping engine
                return engine.quitCommand();
            }).done();
};

module.exports = {
    analyze: function(game, gameModel, chessJS, socketioGameNamespace, engine) {
        engine = engine || new Engine(engineConfig.enginePath);

        startAnalizing(game, gameModel, chessJS, socketioGameNamespace, engine);
    }
};