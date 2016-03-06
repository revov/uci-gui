export class Game {
    _id: string;
    pgn: string;
    analysis: {
        moves: [
                {
                    bestMove: string,
                    score: {
                        cp: string,
                        mate: string
                    }
                }
        ],
        status: string,
        progress: number
    };
    white: string;
    black: string;
    whiteElo: string;
    blackElo: string;
    round: string;
    result: string;
    event: string;
    site: string;
    datePlayed: string;
    dateUploaded: Date;
    uploadedByUserId: string;
}