var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GameSchema = new Schema({
    pgn: { type: String, required: true },
    analysis: {
        moves: [
                {
                    bestMove: { type: String, required: true },
                    score: { type: String, required: true }
                }
        ],
        status: { type: String, required: true }
    },
    white: { type: String, required: true },
    black: { type: String, required: true },
    dateUploaded: { type: Date, default: Date.now },
    uploadedByUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true }
});

module.exports = mongoose.model('Game',GameSchema);