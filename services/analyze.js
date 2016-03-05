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

function startAnalizing(game, gameModel, chess, engine) {
    // convert the pgn notation to long algebraic notation
    var moves = convertPGNToLAN(chess.history({verbose: true}));
    if(!moves.length) {
        console.log('Game contains no moves');
        return;
    }

    var movesCount = moves.length;
    // check if we have in checkmate, in threefold repetition, in stalemate or insufficient material - if yes do not analyze the last move
    if( chess.in_checkmate() || chess.in_stalemate() || chess.in_threefold_repetition() || chess.insufficient_material() ) {
        movesCount -= 1;
    }

    var updateCriteria = {_id: game._id};

    var promiseChain = engine.runProcess()
                        .then(function() {
                            return gameModel.update(updateCriteria,
                                { $set: { 'analysis.status': constants.StatusTypes.Analyzing }})
                                .exec();
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
        let currentMoveForPromise = currentMove;
        let currentScore = '';
        promiseChain = promiseChain.then(function () {
                        // Position set
                        return engine.positionCommand('startpos', currentMoveForPromise.trim());
                    }).then(function () {
                        // Starting analysis
                        return engine.goInfiniteCommand(function infoHandler(info) {
                            let matches = info.match(constants.Analyze.ScoreRegex);
                            if(matches && matches[1]) {
                                currentScore = matches[1];
                            }
                        });
                    }).delay(constants.Analyze.Delay)
                    .then(function () {
                        // Stopping analysis
                        return engine.stopCommand();
                    }).then(function (bestmove) {
                        return gameModel.update(updateCriteria,
                                    { $push: { 'analysis.moves': {bestMove: bestmove.from + ' ' + bestmove.to, score: currentScore} }})
                                .exec();
                    });
    }

    promiseChain.then(function () {
                // Stopping engine
                return engine.quitCommand();
            }).then(function () {
                return gameModel.update(updateCriteria,
                            { $set: { 'analysis.status': constants.StatusTypes.Complete }})
                        .exec();
            }).fail(function (error) {
                console.error('Error:', error);
                // Stopping engine
                return engine.quitCommand();
            }).done();
};

module.exports = {
    analyze: function(game, gameModel, chessJS, engine) {
        engine = engine || new Engine(engineConfig.enginePath);

        startAnalizing(game, gameModel, chessJS, engine);
    }
};