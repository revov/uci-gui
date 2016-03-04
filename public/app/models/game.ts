export class Game {
    _id: string;
    pgn: string;
    analysis: {
        moves: [
                {
                    bestMove: string,
                    score: string
                }
        ],
        status: string
    };
    white: string;
    black: string;
    dateUploaded: Date;
    uploadedByUserId: string;
}