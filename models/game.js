var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var constants = require('../constants/constants');

var GameSchema = new Schema({
    pgn: { type: String, required: true },
    analysis: {
        moves: [
                {
                    bestMove: { type: String, required: true },
                    score: { type: String, required: true }
                }
        ],
        status: { type: String, required: true, default: constants.StatusTypes.Pending }
    },
    white: { type: String, required: true, default: constants.NotAvailable },
    black: { type: String, required: true, default: constants.NotAvailable },
    whiteElo: { type: String, default: constants.NotAvailable },
    blackElo: { type: String, default: constants.NotAvailable },
    round: { type: Number, default: 0 },
    result: { type: String, default: constants.NotAvailable },
    event: { type: String, default: constants.NotAvailable },
    site: { type: String, default: constants.NotAvailable },
    datePlayed: { type: String, default: constants.NotAvailable },
    dateUploaded: { type: Date, default: Date.now },
    uploadedByUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true }
});

module.exports = mongoose.model('Game',GameSchema);